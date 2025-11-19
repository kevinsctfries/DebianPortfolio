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
  const [, setRefresh] = useState(false);

  // snap positions to the grid
  const snapToGrid = (value: number) =>
    Math.round(value / GRID_SIZE) * GRID_SIZE;

  // start icons in a neat little column
  const getInitialPosition = (index: number) => ({
    x: 0,
    y: index * GRID_SIZE,
  });

  // keep track of where each icon lives
  const [iconPositions, setIconPositions] = useState<
    Record<string, { x: number; y: number }>
  >(() => {
    const positions: Record<string, { x: number; y: number }> = {};

    desktopApps.forEach((app, idx) => {
      positions[app.id] = getInitialPosition(idx);
    });

    return positions;
  });

  // grab my github projects when the page loads
  useEffect(() => {
    const selectedRepos = [{ owner: "kevinsctfries", repo: "DebianPortfolio" }];
    populateProjects(selectedRepos, linuxFS).then(() =>
      setRefresh(prev => !prev)
    );
  }, []);

  // walk the fake filesystem to find a folder's full path
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

  // drop the Projects folder on the desktop once we find it
  useEffect(() => {
    const projectsNode =
      linuxFS["/"].contents?.home.contents?.Kevin.contents?.Desktop.contents
        ?.Projects;

    if (projectsNode) {
      const pathToProjects = findPathToNode(linuxFS, projectsNode);
      const folder: DesktopFolder = {
        id: "projects",
        name: "Projects",
        icon: folderIcon,
        contents: projectsNode,
        path: pathToProjects ?? ["/"],
      };
      setDesktopFolders([folder]);
    }
  }, []);

  // give folders a spot once they show up
  useEffect(() => {
    setIconPositions(prev => {
      const next = { ...prev };
      desktopFolders.forEach((folder, idx) => {
        if (!next[folder.id]) {
          next[folder.id] = getInitialPosition(desktopApps.length + idx);
        }
      });
      return next;
    });
  }, [desktopFolders]);

  const handleDrag = (id: string, x: number, y: number) => {
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);

    setIconPositions(prev => {
      const otherId = Object.keys(prev).find(
        key =>
          key !== id && prev[key].x === snappedX && prev[key].y === snappedY
      );

      if (otherId) {
        return {
          ...prev,
          [id]: { ...prev[otherId] },
          [otherId]: { x: prev[id].x, y: prev[id].y },
        };
      }

      return { ...prev, [id]: { x: snappedX, y: snappedY } };
    });
  };

  return (
    <div className={styles.desktop}>
      {/* app icons */}
      {desktopApps.map(app => (
        <DesktopIcon
          key={app.id}
          name={app.name}
          icon={app.icon.src}
          x={iconPositions[app.id]?.x ?? 0}
          y={iconPositions[app.id]?.y ?? 0}
          onDragStop={(x, y) => handleDrag(app.id, x, y)}
          onClick={() => openApp(app.id)}
        />
      ))}

      {/* folder icons */}
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

      {/* open windows */}
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
