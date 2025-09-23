export type AppName = "about" | "terminal" | "minesweeper";

export type DesktopApp = {
  id: AppName;
  name: string;
  icon: string;
  desc?: string;
  category?: string;
};

export const desktopApps: DesktopApp[] = [
  {
    id: "about",
    name: "About",
    icon: "/gnome-info.webp",
    desc: "About this system",
    category: "settings",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "/gnome-eterm.webp",
    desc: "Command line interface",
    category: "system",
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    icon: "/minesweeper.webp",
    desc: "Classic game",
    category: "games",
  },
];
