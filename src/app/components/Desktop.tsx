"use client";

import styles from "../styles/desktop.module.scss";
import Panel from "./Panel";
import { AppName, useDesktop } from "./DesktopContext";
import Window from "./Window";
import About from "../apps/About";
import Terminal from "../apps/Terminal";
import DesktopIcon from "./DesktopIcon";
import { useState } from "react";

export type DesktopApp = {
  id: "about" | "terminal";
  name: string;
  icon: string;
};

export const desktopApps: DesktopApp[] = [
  { id: "about", name: "About", icon: "ℹ️" },
  { id: "terminal", name: "Terminal", icon: "🖥️" },
];

export default function Desktop() {
  const { openApps, openApp, closeApp } = useDesktop();

  const getAppComponent = (appId: AppName) => {
    switch (appId) {
      case "about":
        return <About />;
      case "terminal":
        return <Terminal />;
      default:
        return null;
    }
  };

  const [iconPositions, setIconPositions] = useState<
    Record<string, { x: number; y: number }>
  >(() =>
    desktopApps.reduce((acc, app, idx) => {
      acc[app.id] = { x: 20, y: 20 + idx * 80 };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );

  const updatePosition = (id: string, x: number, y: number) => {
    setIconPositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  return (
    <div className={styles.desktop}>
      <Panel />

      {desktopApps.map(app => (
        <DesktopIcon
          key={app.id}
          name={app.name}
          icon={app.icon}
          x={iconPositions[app.id].x}
          y={iconPositions[app.id].y}
          onDragStop={(x, y) => updatePosition(app.id, x, y)}
          onClick={() => openApp(app.id)}
        />
      ))}

      {openApps.map(appId => (
        <Window key={appId} title={appId} onClose={() => closeApp(appId)}>
          {getAppComponent(appId)}
        </Window>
      ))}
    </div>
  );
}
