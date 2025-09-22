"use client";

import styles from "../styles/desktop.module.scss";
import Panel from "./Panel";
import { useDesktop } from "./DesktopContext";
import Window from "./Window";
import About from "../apps/About";

export default function Desktop() {
  const { openApps, closeApp } = useDesktop();

  return (
    <div className={styles.desktop}>
      <Panel />
      {openApps.includes("about") && (
        <Window title="About" onClose={() => closeApp("about")}>
          <About />
        </Window>
      )}
      {/* Later: add Terminal + File Manager here */}
    </div>
  );
}
