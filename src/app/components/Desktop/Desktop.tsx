"use client";

import styles from "./desktop.module.scss";
import { useDesktop } from "./DesktopContext";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import { useState } from "react";
import { desktopApps } from "./appData";

const GRID_SIZE = 80;
const PANEL_HEIGHT = 40;

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

  const [highlight, setHighlight] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleDrag = (x: number, y: number) => {
    const snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round((y - PANEL_HEIGHT) / GRID_SIZE) * GRID_SIZE;
    setHighlight({ x: snappedX, y: snappedY + PANEL_HEIGHT });
  };

  const handleDragStop = (id: string, x: number, y: number) => {
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

    setHighlight(null);
  };

  return (
    <div className={styles.desktop}>
      {highlight && (
        <div
          className={styles.gridHighlight}
          style={{ left: highlight.x, top: highlight.y }}
        />
      )}

      {desktopApps.map(app => (
        <DesktopIcon
          key={app.id}
          name={app.name}
          icon={app.icon}
          x={iconPositions[app.id].x}
          y={iconPositions[app.id].y}
          onDrag={handleDrag}
          onDragStop={(x, y) => handleDragStop(app.id, x, y)}
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
