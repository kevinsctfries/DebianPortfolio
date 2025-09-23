"use client";

import { useContext, useState, useRef, useEffect } from "react";
import styles from "./menu.module.scss";
import { useDesktop, AppName } from "../Desktop/DesktopContext";

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

  const apps: AppEntry[] = [
    {
      id: "about",
      name: "About",
      desc: "...",
      category: "settings",
      icon: "ℹ️",
    },
    {
      id: "terminal",
      name: "Terminal",
      desc: "...",
      category: "system",
      icon: "🖥️",
    },
  ];

  const categories: Category[] = [
    { id: "favorites", name: "Favorites", icon: "⭐" },
    { id: "recently-used", name: "Recently Used", icon: "🕒" },
    { id: "all", name: "All Applications", icon: "📂" },
    { id: "accessories", name: "Accessories", icon: "🛠️" },
    { id: "graphics", name: "Graphics", icon: "🎨" },
    { id: "internet", name: "Internet", icon: "🌐" },
    { id: "multimedia", name: "Multimedia", icon: "🎥" },
    { id: "office", name: "Office", icon: "📄" },
    { id: "settings", name: "Settings", icon: "⚙️" },
    { id: "system", name: "System", icon: "💻" },
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
            <button
              key={cat.id}
              className={`${styles.categoryButton} ${
                selectedCategory === cat.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedCategory(cat.id)}>
              <span className={styles.categoryIcon}>{cat.icon}</span>
              <span className={styles.categoryLabel}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.user}>
          <span className={styles.userAvatar}>👤</span>
          <span className={styles.userName}>Kevin</span>
        </div>
        <div className={styles.searchBar}>
          <label htmlFor="menuSearch" className={styles.visuallyHidden}>
            Search applications
          </label>
          <input
            id="menuSearch"
            ref={searchRef}
            type="text"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.commands}>
          <button className={styles.commandButton}>🔄</button>
          <button className={styles.commandButton}>🔒</button>
          <button className={styles.commandButton}>⏻</button>
        </div>
      </div>
    </div>
  );
}
