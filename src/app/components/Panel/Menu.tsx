"use client";

import { useContext, useState, useRef, useEffect } from "react";
import styles from "./menu.module.scss";
import { useDesktop } from "../Desktop/DesktopContext";
import { AppName, desktopApps } from "../Desktop/appData";
import Image from "next/image";

import { StaticImageData } from "next/image";

// category icons
import favoritesIcon from "../../assets/system/starred.svg";
import recentlyUsed from "../../assets/system/folder-recent.svg";
import allApplications from "../../assets/system/applications-other.svg";
import accessoriesApps from "../../assets/system/applications-accessories.svg";
import settingsApp from "../../assets/system/preferences-desktop.svg";
import systemIcon from "../../assets/system/preferences-system.svg";

// other menu icons
import profileIcon from "../../assets/system/preferences-desktop-personal.svg";
import lockscreenIcon from "../../assets/system/system-lock-screen.svg";
import logoutIcon from "../../assets/system/system-log-out.svg";
import searchIcon from "../../assets/system/edit-find-symbolic.svg";

type MenuProps = {
  onClose: () => void;
};

type AppEntry = {
  id: AppName;
  name: string;
  desc: string;
  category: string;
  icon: string | StaticImageData;
};

type Category = {
  id: string;
  name: string;
  icon: string;
};

export default function Menu({ onClose }: MenuProps) {
  const { openApp } = useDesktop();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("favorites");
  const searchRef = useRef<HTMLInputElement>(null);

  const apps: AppEntry[] = desktopApps.map(app => ({
    id: app.id,
    name: app.name,
    desc: app.desc || "",
    category: app.category || "",
    icon: app.icon,
  }));

  const categories: Category[] = [
    { id: "favorites", name: "Favorites", icon: favoritesIcon },
    {
      id: "recently-used",
      name: "Recently Used",
      icon: recentlyUsed,
    },
    {
      id: "all",
      name: "All Applications",
      icon: allApplications,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: accessoriesApps,
    },
    {
      id: "settings",
      name: "Settings",
      icon: settingsApp,
    },
    { id: "system", name: "System", icon: systemIcon },
  ];

  // Filter apps based on search and category
  const filteredApps = apps.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      !searchTerm;
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "favorites" ||
      selectedCategory === "recently-used" ||
      app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // For favorites/recently-used: empty for now (no dummy apps)
  const getAppsForCategory = () => {
    if (
      selectedCategory === "favorites" ||
      selectedCategory === "recently-used"
    ) {
      return []; // Empty as per no dummies
    }
    return filteredApps;
  };

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleAppClick = (appId: AppName) => {
    openApp(appId);
    onClose();
  };

  return (
    <div className={styles.menu}>
      <div className={styles.topBar}>
        <div className={styles.user}>
          <Image
            src={profileIcon}
            alt="Profile"
            width={32}
            height={32}
            className={styles.categoryIcon}
          />
          <span className={styles.userName}>Kevin</span>
        </div>
        <div className={styles.commands}>
          <button className={styles.commandButton}>
            <Image
              src={settingsApp}
              alt="Settings Manager"
              width={24}
              height={24}
              className={styles.categoryIcon}
            />
          </button>
          <button className={styles.commandButton}>
            <Image
              src={lockscreenIcon}
              alt="Lock Screen"
              width={24}
              height={24}
              className={styles.categoryIcon}
            />
          </button>
          <button className={styles.commandButton}>
            <Image
              src={logoutIcon}
              alt="Log Out..."
              width={24}
              height={24}
              className={styles.categoryIcon}
            />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.appsList}>
          <ul>
            {getAppsForCategory().map(app => (
              <li key={app.id}>
                <button
                  className={styles.appButton}
                  onClick={() => handleAppClick(app.id)}>
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={22}
                    height={22}
                    className={styles.appIcon}
                  />
                  <div className={styles.appText}>
                    <span className={styles.appName}>{app.name}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.sidebar}>
          {categories.map(cat => (
            <div key={cat.id}>
              <button
                key={cat.id}
                className={`${styles.categoryButton} ${
                  selectedCategory === cat.id ? styles.selected : ""
                }`}
                onClick={() => setSelectedCategory(cat.id)}>
                <Image
                  src={cat.icon}
                  alt={cat.name}
                  width={18}
                  height={18}
                  className={styles.categoryIcon}
                />
                <span className={styles.categoryLabel}>{cat.name}</span>
              </button>

              {cat.id === "all" && <hr className={styles.divider} />}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.searchBar}>
        <Image
          src={searchIcon}
          alt="Search"
          className={styles.searchIcon}
          width={16}
          height={16}
        />
        <input
          id="menuSearch"
          ref={searchRef}
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
