import About from "@/app/apps/About/About";
import Terminal from "@/app/apps/Terminal/Terminal";
import Minesweeper from "@/app/apps/Minesweeper/Minesweeper";

export type AppName = "about" | "terminal" | "minesweeper";

export type DesktopApp = {
  id: AppName;
  name: string;
  icon: string;
  desc?: string;
  category?: string;
  component: React.ReactNode;
};

export const desktopApps: DesktopApp[] = [
  {
    id: "about",
    name: "About",
    icon: "/apps/dialog-information.svg",
    component: <About />,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "/apps/utilities-terminal.svg",
    component: <Terminal />,
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    icon: "/apps/minesweeper.webp",
    component: <Minesweeper />,
  },
];
