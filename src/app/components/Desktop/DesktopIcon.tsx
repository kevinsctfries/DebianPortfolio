"use client";

import { Rnd } from "react-rnd";
import styles from "./desktop.module.scss";
import Image from "next/image";
import { GRID_SIZE } from "./DesktopContext";
import { useRef } from "react";

type DesktopIconProps = {
  name: string;
  icon: string;
  onClick: () => void;
  x?: number;
  y?: number;
  onDragStop?: (x: number, y: number) => void;
  onDrag?: (x: number, y: number) => void;
};

export default function DesktopIcon({
  name,
  icon,
  onClick,
  x = 0,
  y = 0,
  onDragStop,
  onDrag,
}: DesktopIconProps) {
  const lastTouchTimeRef = useRef<number>(0);

  const onDoubleTap = () => {
    const now = Date.now();
    const isDoubleTap = now - lastTouchTimeRef.current < 300;
    lastTouchTimeRef.current = now;

    if (isDoubleTap) {
      onClick();
    }
  };

  return (
    <Rnd
      position={{ x, y }}
      size={{ width: 64, height: 64 }}
      bounds="parent"
      enableResizing={false}
      onDrag={(e, d) => {
        onDrag?.(d.x, d.y);
      }}
      onDragStop={(e, d) => {
        const snappedX = Math.round(d.x / GRID_SIZE) * GRID_SIZE;
        const snappedY = Math.round(d.y / GRID_SIZE) * GRID_SIZE;
        onDragStop?.(snappedX, snappedY);
      }}>
      <div
        className={styles.desktopIcon}
        onDoubleClick={onClick}
        onTouchEnd={onDoubleTap}>
        <Image
          src={icon}
          alt={name}
          width={48}
          height={48}
          className={styles.icon}
        />
        <div className={styles.label}>{name}</div>
      </div>
    </Rnd>
  );
}
