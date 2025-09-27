"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import styles from "./panel.module.scss";
import Menu from "./Menu";
import { useDesktop } from "../Desktop/DesktopContext";
import Image from "next/image";
import { desktopApps } from "../Desktop/appData";

import menuIcon from "../../assets/system/distributor-logo-xubuntu.svg";

export default function Panel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openApps, openApp, activeApp, bringToFront } = useDesktop();
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const zonedTime = toZonedTime(
        now,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
      setTime(zonedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const getAppIcon = (appId: string) => {
    const app = desktopApps.find(a => a.id === appId);
    return app?.icon || "/gnome-info.webp";
  };

  return (
    <div className={styles.panel}>
      <button
        className={`${styles.menuButton} ${menuOpen ? styles.active : ""}`}
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}>
        <Image src={menuIcon} alt="Open Menu" width={18} height={18} />
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
            className={`${styles.appButton} ${
              activeApp === appId ? styles.active : ""
            }`}
            onClick={() => {
              if (activeApp !== appId) bringToFront(appId);
              else bringToFront(appId);
            }}
            title={appId}>
            <Image src={getAppIcon(appId)} alt={appId} width={20} height={20} />
            <span className={styles.appName}>{appId}</span>
          </button>
        ))}
      </div>

      <div className={styles.clock}>
        {mounted && time ? format(time, "MMM dd, hh:mm:ss a") : ""}
      </div>
    </div>
  );
}
