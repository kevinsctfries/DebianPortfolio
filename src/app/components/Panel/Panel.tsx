"use client";

import { useState } from "react";
import styles from "./panel.module.scss";
import Menu from "./Menu";
import { useDesktop } from "../Desktop/DesktopContext";
import Image from "next/image";
import { desktopApps } from "../Desktop/appData";

export default function Panel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openApps, openApp } = useDesktop();

  const getAppIcon = (appId: string) => {
    const app = desktopApps.find(a => a.id === appId);
    return app?.icon || "/gnome-info.webp";
  };

  return (
    <div className={styles.panel}>
      <button
        className={styles.menuButton}
        onClick={() => {
          console.log("Panel menu button clicked, before:", menuOpen);
          setMenuOpen(!menuOpen);
        }}>
        🐭
      </button>

      {menuOpen && (
        <Menu
          onClose={() => {
            console.log("Closing menu");
            setMenuOpen(false);
          }}
        />
      )}

      <div className={styles.openedApps}>
        {openApps.map(appId => (
          <button
            key={appId}
            className={styles.appButton}
            onClick={() => openApp(appId)}
            title={appId}>
            <Image src={getAppIcon(appId)} alt={appId} width={20} height={20} />
            <span className={styles.appName}>{appId}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
