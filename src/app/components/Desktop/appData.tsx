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
    icon: "/gnome-info.webp",
    component: <About />,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "/gnome-eterm.webp",
    component: <Terminal />,
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    icon: "/minesweeper.webp",
    component: <Minesweeper />,
  },
];
