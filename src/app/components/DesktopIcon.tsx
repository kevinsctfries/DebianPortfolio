"use client";

import { Rnd } from "react-rnd";
import styles from "../styles/desktop.module.scss";
import Image from "next/image";

type DesktopIconProps = {
  name: string;
  icon: string;
  onClick: () => void;
  x?: number;
  y?: number;
  onDragStop?: (x: number, y: number) => void;
};

export default function DesktopIcon({
  name,
  icon,
  onClick,
  x = 0,
  y = 0,
  onDragStop,
}: DesktopIconProps) {
  return (
    <Rnd
      position={{ x, y }}
      size={{ width: 64, height: 64 }}
      bounds="parent"
      onDragStop={(e, d) => {
        const gridSize = 80;
        const snappedX = Math.round(d.x / gridSize) * gridSize;
        const snappedY = Math.round(d.y / gridSize) * gridSize;
        onDragStop?.(snappedX, snappedY);
      }}>
      <div className={styles.desktopIcon} onDoubleClick={onClick}>
        <Image src={icon} alt={name} width={48} height={48} />
        <div className={styles.label}>{name}</div>
      </div>
    </Rnd>
  );
}
