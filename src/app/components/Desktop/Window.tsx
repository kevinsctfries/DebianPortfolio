"use client";

import { Rnd } from "react-rnd";
import styles from "./window.module.scss";
import { ReactNode } from "react";

type WindowProps = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onFocus?: () => void;
  zIndex?: number;
  defaultX?: number;
  defaultY?: number;
  width?: number;
  height?: number;
  fixedSize?: boolean;
};

export default function Window({
  title,
  children,
  onClose,
  onFocus,
  zIndex = 1,
  defaultX = 100,
  defaultY = 100,
  width = 800,
  height = 600,
  fixedSize = false,
}: WindowProps) {
  return (
    <Rnd
      default={{
        x: defaultX,
        y: defaultY,
        width,
        height,
      }}
      minWidth={200}
      minHeight={100}
      bounds="parent"
      dragHandleClassName={styles.titlebar}
      enableResizing={fixedSize ? false : undefined}
      className={styles.window}
      style={{ zIndex }}
      onMouseDown={() => {
        onFocus?.();
        try {
          document.dispatchEvent(
            new CustomEvent("desktop-window-interacted", {
              detail: { title },
            })
          );
        } catch {
          document.dispatchEvent(new Event("desktop-window-interacted"));
        }
      }}>
      <div className={styles.inner}>
        <div className={styles.titlebar}>
          <span>{title}</span>
          <div className={styles.controls}>
            <button className={styles.minimize} aria-label="Minimize">
              <svg viewBox="0 0 10 10" width="10" height="10">
                <line
                  x1="2"
                  y1="7"
                  x2="8"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button className={styles.maximize} aria-label="Maximize">
              <svg viewBox="0 0 10 10" width="10" height="10">
                <rect
                  x="2"
                  y="2"
                  width="6"
                  height="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className={styles.close}
              aria-label="Close">
              <svg viewBox="0 0 10 10" width="10" height="10">
                <path
                  d="M2 2 L8 8 M8 2 L2 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </Rnd>
  );
}
