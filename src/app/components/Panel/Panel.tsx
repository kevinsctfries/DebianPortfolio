"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import styles from "./panel.module.scss";
import Menu from "./Menu";
import { useDesktop } from "../Desktop/DesktopContext";
import Image from "next/image";
import { desktopApps } from "../Desktop/appData";

export default function Panel() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openApps, openApp } = useDesktop();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const zonedTime = toZonedTime(
        now,
        Intl.DateTimeFormat().resolvedOptions().timeZone
      );
      setTime(zonedTime);
    }, 1000);

    return () => clearInterval(timer);
  });

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
        <Image
          src="/system/distributor-logo-xubuntu.svg"
          alt="Open Menu"
          width={32}
          height={32}
        />
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

      <div className={styles.clock}>{format(time, "MMM dd, hh:mm:ss a")}</div>
    </div>
  );
}
