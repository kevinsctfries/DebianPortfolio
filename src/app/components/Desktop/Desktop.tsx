"use client";

import styles from "./desktop.module.scss";
import { GRID_SIZE, useDesktop } from "./DesktopContext";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import { useState } from "react";
import { desktopApps } from "./appData";

export default function Desktop() {
  const { openApps, openApp, closeApp } = useDesktop();

  const [iconPositions, setIconPositions] = useState<
    Record<string, { x: number; y: number }>
  >(() =>
    desktopApps.reduce((acc, app, idx) => {
      const rawX = 20;
      const rawY = 20 + idx * GRID_SIZE;
      acc[app.id] = {
        x: Math.round(rawX / GRID_SIZE) * GRID_SIZE,
        y: Math.round(rawY / GRID_SIZE) * GRID_SIZE,
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>)
  );

  const handleDrag = (id: string, x: number, y: number) => {
    setIconPositions(prev => {
      const otherId = Object.keys(prev).find(
        key => key !== id && prev[key].x === x && prev[key].y === y
      );

      if (otherId) {
        return {
          ...prev,
          [id]: { ...prev[otherId] },
          [otherId]: { x: prev[id].x, y: prev[id].y },
        };
      }

      return { ...prev, [id]: { x, y } };
    });
  };

  return (
    <div className={styles.desktop}>
      {desktopApps.map(app => (
        <DesktopIcon
          key={app.id}
          name={app.name}
          icon={app.icon}
          x={iconPositions[app.id].x}
          y={iconPositions[app.id].y}
          onDragStop={(x, y) => handleDrag(app.id, x, y)}
          onClick={() => openApp(app.id)}
        />
      ))}

      {openApps.map(appId => {
        const app = desktopApps.find(a => a.id === appId);
        if (!app) return null;

        return (
          <Window
            key={appId}
            title={appId}
            onClose={() => closeApp(appId)}
            fixedSize={appId === "minesweeper"}
            width={appId === "minesweeper" ? 400 : undefined}
            height={appId === "minesweeper" ? 435 : undefined}>
            {app.component}
          </Window>
        );
      })}
    </div>
  );
}
