"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AppName } from "./appData";

type DesktopContextType = {
  openApps: AppName[];
  openApp: (app: AppName) => void;
  closeApp: (app: AppName) => void;
  bringToFront: (app: AppName) => void;
  getZIndex: (app: AppName) => number;
  activeApp: AppName | null;
};

export const GRID_SIZE = 80;
export const PANEL_HEIGHT = 24;

const DesktopContext = createContext<DesktopContextType | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [openApps, setOpenApps] = useState<AppName[]>([]);
  const [zIndexes, setZIndexes] = useState<Partial<Record<AppName, number>>>(
    {}
  );
  const [topZ, setTopZ] = useState(1);

  const activeApp =
    openApps.length > 0
      ? openApps.reduce((top, app) =>
          (zIndexes[app] ?? -Infinity) > (zIndexes[top] ?? -Infinity)
            ? app
            : top
        )
      : null;

  function openApp(app: AppName) {
    if (!openApps.includes(app)) {
      setOpenApps([...openApps, app]);
      bringToFront(app);
    }
  }

  function closeApp(app: AppName) {
    setOpenApps(openApps.filter(a => a !== app));
    setZIndexes(prev => {
      const copy = { ...prev };
      delete copy[app];
      return copy;
    });
  }

  function bringToFront(app: AppName) {
    const newZ = topZ + 1;
    setZIndexes(prev => ({ ...prev, [app]: newZ }));
    setTopZ(newZ);
  }

  function getZIndex(app: AppName) {
    return zIndexes[app] ?? 1;
  }

  return (
    <DesktopContext.Provider
      value={{
        openApps,
        openApp,
        closeApp,
        bringToFront,
        getZIndex,
        activeApp,
      }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside DesktopProvider");
  return ctx;
}
