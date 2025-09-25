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
  width = 400,
  height = 300,
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
      onMouseDown={onFocus}>
      <div className={styles.inner}>
        <div className={styles.titlebar}>
          <span>{title}</span>
          <div className={styles.controls}>
            <button className={styles.btn}>_</button>
            <button className={styles.btn}>□</button>
            <button onClick={onClose} className={styles.btn}>
              ×
            </button>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </Rnd>
  );
}
