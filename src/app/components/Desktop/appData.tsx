import About from "@/app/apps/About/About";
import Terminal from "@/app/apps/Terminal/Terminal";
import Minesweeper from "@/app/apps/Minesweeper/Minesweeper";

import minesweeperIcon from "../../assets/apps/minesweeper.webp";
import terminalIcon from "../../assets/apps/utilities-terminal.svg";
import aboutIcon from "../../assets/apps/dialog-information.svg";

import type { StaticImageData } from "next/image";

export type AppName = "about" | "terminal" | "minesweeper";

export type DesktopApp = {
  id: AppName;
  name: string;
  icon: StaticImageData;
  desc?: string;
  category?: string;
  component: React.ReactNode;
};

export const desktopApps: DesktopApp[] = [
  {
    id: "about",
    name: "About",
    icon: aboutIcon,
    component: <About />,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: terminalIcon,
    component: <Terminal />,
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    icon: minesweeperIcon,
    component: <Minesweeper />,
  },
];
