import About from "@/app/apps/About/About";
import Terminal from "@/app/apps/Terminal/Terminal";
import Minesweeper from "@/app/apps/Minesweeper/Minesweeper";
import FileExplorer from "@/app/apps/FileExplorer/FileExplorer";
import Settings from "@/app/apps/Settings/Settings";

import minesweeperIcon from "../../assets/apps/minesweeper.webp";
import terminalIcon from "../../assets/apps/utilities-terminal.svg";
import aboutIcon from "../../assets/apps/dialog-information.svg";
import folderIcon from "../../assets/system/system-file-manager.svg";
import settingsApp from "../../assets/system/preferences-desktop.svg";

import type { StaticImageData } from "next/image";
import type { ComponentType } from "react";

export type AppName =
  | "about"
  | "terminal"
  | "minesweeper"
  | "thunar"
  | "monaco"
  | "settings";

export type DesktopAppProps = Record<string, unknown>;

export type DesktopApp = {
  id: AppName;
  name: string;
  icon: StaticImageData;
  desc?: string;
  category?: string;
  component: ComponentType<DesktopAppProps>;
  showOnDesktop?: boolean;
};

export const desktopApps: DesktopApp[] = [
  {
    id: "about",
    name: "About",
    icon: aboutIcon,
    desc: "Information about this portfolio",
    category: "favorites",
    component: About,
    showOnDesktop: true,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: terminalIcon,
    desc: "Linux terminal emulator",
    category: "favorites",
    component: Terminal,
    showOnDesktop: true,
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    icon: minesweeperIcon,
    desc: "Classic minesweeper game",
    category: "games",
    component: Minesweeper,
    showOnDesktop: true,
  },
  {
    id: "thunar",
    name: "Thunar",
    icon: folderIcon,
    desc: "File manager",
    category: "utilities",
    component: FileExplorer,
    showOnDesktop: true,
  },
  {
    id: "settings",
    name: "Settings",
    icon: settingsApp,
    desc: "Application settings",
    category: "system",
    component: Settings,
    showOnDesktop: false,
  },
];
