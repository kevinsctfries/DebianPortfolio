"use client";

import styles from "./desktop.module.scss";
import { GRID_SIZE, useDesktop } from "./DesktopContext";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import { useEffect, useState } from "react";
import { desktopApps } from "./appData";
import { populateProjects } from "@/app/utils/github";
import linuxFSJSon from "@/app/data/linux-fs.json";
import type { FileNode } from "@/app/apps/FileExplorer/FileExplorer";
import folderIcon from "../../assets/places/folder.svg";

type DesktopFolder = {
  id: string;
  name: string;
  icon: string;
  contents: FileNode;
  path?: string[];
};

const linuxFS = linuxFSJSon as Record<string, FileNode>;

export default function Desktop() {
  const { openApps, openApp, closeApp, bringToFront, getZIndex, appProps } =
    useDesktop();
  const [desktopFolders, setDesktopFolders] = useState<DesktopFolder[]>([]);

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

  const [, setRefresh] = useState(false);

  useEffect(() => {
    const selectedRepos = [{ owner: "kevinsctfries", repo: "DebianPortfolio" }];

    populateProjects(selectedRepos, linuxFS).then(() => {
      setRefresh(prev => !prev);
    });
  }, []);

  function findPathToNode(
    tree: Record<string, FileNode>,
    targetNode: FileNode,
    currentPath: string[] = []
  ): string[] | null {
    for (const [name, node] of Object.entries(tree)) {
      const newPath = [...currentPath, name];
      if (node === targetNode) return newPath;

      if (node.contents) {
        const found = findPathToNode(node.contents, targetNode, newPath);
        if (found) return found;
      }
    }
    return null;
  }

  useEffect(() => {
    const projectsNode =
      linuxFS["/"].contents?.home.contents?.Kevin.contents?.Desktop.contents
        ?.Projects;

    if (projectsNode) {
      const pathToProjects = findPathToNode(linuxFS, projectsNode);
      setDesktopFolders([
        {
          id: "projects",
          name: "Projects",
          icon: folderIcon,
          contents: projectsNode,
          path: pathToProjects ?? ["/"],
        },
      ]);
    }
  }, []);

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
          icon={app.icon.src}
          x={iconPositions[app.id].x}
          y={iconPositions[app.id].y}
          onDragStop={(x, y) => handleDrag(app.id, x, y)}
          onClick={() => openApp(app.id)}
        />
      ))}

      {desktopFolders.map(folder => (
        <DesktopIcon
          key={folder.id}
          name={folder.name}
          icon={folder.icon}
          x={iconPositions[folder.id]?.x ?? 0}
          y={iconPositions[folder.id]?.y ?? 0}
          onDragStop={(x, y) => handleDrag(folder.id, x, y)}
          onClick={() => openApp("thunar", { startPath: folder.path })}
        />
      ))}

      {openApps.map(appId => {
        const app = desktopApps.find(a => a.id === appId);
        if (!app) return null;

        const props = appProps[appId] || {};
        const AppComponent = app.component;

        return (
          <Window
            key={appId}
            title={appId}
            onClose={() => closeApp(appId)}
            fixedSize={appId === "minesweeper"}
            width={appId === "minesweeper" ? 400 : undefined}
            height={appId === "minesweeper" ? 435 : undefined}
            zIndex={getZIndex(appId)}
            onFocus={() => bringToFront(appId)}>
            <AppComponent {...props} />
          </Window>
        );
      })}
    </div>
  );
}
