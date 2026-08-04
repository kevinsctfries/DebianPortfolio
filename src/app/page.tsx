"use client";

import { useEffect, useState } from "react";
import Desktop from "./components/Desktop/Desktop";
import {
  DesktopProvider,
  useDesktop,
} from "./components/Desktop/DesktopContext";
import Panel from "./components/Panel/Panel";
import LoginManager from "./components/LoginManager/LoginManager";
import styles from "./page.module.scss";

function Shell() {
  const [unlocked, setUnlocked] = useState(false);
  const { openApps, closeApp } = useDesktop();

  useEffect(() => {
    const handleLock = () => setUnlocked(false);
    const handleLogOut = () => {
      openApps.forEach((app) => closeApp(app));
      setUnlocked(false);
    };

    document.addEventListener("portfolio-lock-screen", handleLock);
    document.addEventListener("portfolio-log-out", handleLogOut);

    return () => {
      document.removeEventListener("portfolio-lock-screen", handleLock);
      document.removeEventListener("portfolio-log-out", handleLogOut);
    };
  }, [openApps, closeApp]);

  return (
    <div className={styles.layout}>
      <Panel />
      <Desktop />
      {!unlocked && <LoginManager onLogin={() => setUnlocked(true)} />}
    </div>
  );
}

export default function Home() {
  return (
    <DesktopProvider>
      <Shell />
    </DesktopProvider>
  );
}
