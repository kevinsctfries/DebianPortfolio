"use client";

import { Rnd } from "react-rnd";
import styles from "./desktop.module.scss";
import Image from "next/image";
import { GRID_SIZE } from "./DesktopContext";

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
      <div className={styles.desktopIcon} onDoubleClick={onClick}>
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
