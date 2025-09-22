"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AppName = "about" | "terminal" | "files";

type DesktopContextType = {
  openApps: AppName[];
  openApp: (app: AppName) => void;
  closeApp: (app: AppName) => void;
};

const DesktopContext = createContext<DesktopContextType | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [openApps, setOpenApps] = useState<AppName[]>([]);

  function openApp(app: AppName) {
    if (!openApps.includes(app)) {
      setOpenApps([...openApps, app]);
    }
  }

  function closeApp(app: AppName) {
    setOpenApps(openApps.filter(a => a !== app));
  }

  return (
    <DesktopContext.Provider value={{ openApps, openApp, closeApp }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside DesktopProvider");
  return ctx;
}
