"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AppName } from "./appData";

type DesktopContextType = {
  openApps: AppName[];
  openApp: (app: AppName, props?: Record<string, unknown>) => void;
  closeApp: (app: AppName) => void;
  bringToFront: (app: AppName) => void;
  getZIndex: (app: AppName) => number;
  activeApp: AppName | null;
  appProps: Partial<Record<AppName, Record<string, unknown>>>;
  minimizedApps: Set<AppName>;
  toggleMinimized: (app: AppName) => void;
  maximizedApps: Set<AppName>;
  toggleMaximized: (app: AppName) => void;
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
  const [appProps, setAppProps] = useState<
    Partial<Record<AppName, Record<string, unknown>>>
  >({});
  const [minimizedApps, setMinimizedApps] = useState<Set<AppName>>(new Set());
  const [maximizedApps, setMaximizedApps] = useState<Set<AppName>>(new Set());

  const activeApp =
    openApps.length > 0
      ? openApps.reduce((top, app) =>
          (zIndexes[app] ?? -Infinity) > (zIndexes[top] ?? -Infinity)
            ? app
            : top
        )
      : null;

  function openApp(app: AppName, props: Record<string, unknown> = {}) {
    setAppProps(prev => ({ ...prev, [app]: props }));

    if (!openApps.includes(app)) {
      setOpenApps(prev => [...prev, app]);
      setMinimizedApps(prev => {
        const next = new Set(prev);
        next.delete(app);
        return next;
      });
      bringToFront(app);
    } else {
      setMinimizedApps(prev => {
        const next = new Set(prev);
        next.delete(app);
        return next;
      });
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
    setAppProps(prev => {
      const copy = { ...prev };
      delete copy[app];
      return copy;
    });
    setMinimizedApps(prev => {
      const next = new Set(prev);
      next.delete(app);
      return next;
    });
    setMaximizedApps(prev => {
      const next = new Set(prev);
      next.delete(app);
      return next;
    });
  }

  function bringToFront(app: AppName) {
    const newZ = topZ + 1;
    setZIndexes(prev => ({ ...prev, [app]: newZ }));
    setTopZ(newZ);
  }

  function getZIndex(app: AppName) {
    return minimizedApps.has(app) ? -1 : zIndexes[app] ?? 1;
  }

  function toggleMinimized(app: AppName) {
    setMinimizedApps(prev => {
      const next = new Set(prev);
      if (next.has(app)) {
        next.delete(app);
      } else {
        next.add(app);
      }
      return next;
    });
  }

  function toggleMaximized(app: AppName) {
    setMaximizedApps(prev => {
      const next = new Set(prev);
      if (next.has(app)) {
        next.delete(app);
      } else {
        next.add(app);
      }
      return next;
    });
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
        appProps,
        minimizedApps,
        toggleMinimized,
        maximizedApps,
        toggleMaximized,
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
