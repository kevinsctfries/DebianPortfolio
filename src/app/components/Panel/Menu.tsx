"use client";

import { useContext, useState, useRef, useEffect } from "react";
import styles from "./menu.module.scss";
import { useDesktop } from "../Desktop/DesktopContext";
import { AppName, desktopApps } from "../Desktop/appData";
import Image from "next/image";

type MenuProps = {
  onClose: () => void;
};

type AppEntry = {
  id: AppName;
  name: string;
  desc: string;
  category: string;
  icon: string;
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
    { id: "favorites", name: "Favorites", icon: "/system/starred.svg" },
    {
      id: "recently-used",
      name: "Recently Used",
      icon: "/system/folder-recent.svg",
    },
    {
      id: "all",
      name: "All Applications",
      icon: "/system/applications-other.svg",
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: "/system/applications-accessories.svg",
    },
    {
      id: "settings",
      name: "Settings",
      icon: "/system/preferences-desktop.svg",
    },
    { id: "system", name: "System", icon: "/system/preferences-system.svg" },
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
            src="/system/preferences-desktop-personal.svg"
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
              src="/system/preferences-desktop.svg"
              alt="Settings Manager"
              width={24}
              height={24}
              className={styles.categoryIcon}
            />
          </button>
          <button className={styles.commandButton}>
            <Image
              src="/system/system-lock-screen.svg"
              alt="Lock Screen"
              width={24}
              height={24}
              className={styles.categoryIcon}
            />
          </button>
          <button className={styles.commandButton}>
            <Image
              src="/system/system-log-out.svg"
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
                  <span className={styles.appIcon}>{app.icon}</span>
                  <div className={styles.appText}>
                    <span className={styles.appName}>{app.name}</span>
                    <span className={styles.appDesc}>{app.desc}</span>
                  </div>
                </button>
              </li>
            ))}
            {getAppsForCategory().length === 0 && (
              <li className={styles.noResults}>No applications found</li>
            )}
          </ul>
        </div>

        <div className={styles.sidebar}>
          {categories.map(cat => (
            <>
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
            </>
          ))}
        </div>
      </div>

      <div className={styles.searchBar}>
        <Image
          src="/system/edit-find-symbolic.svg"
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
