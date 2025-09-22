"use client";

import styles from "../styles/desktop.module.scss";

type DesktopIconProps = {
  name: string;
  icon: string;
  onClick: () => void;
};

export default function DesktopIcon({ name, icon, onClick }: DesktopIconProps) {
  return (
    <div className={styles.desktopIcon} onDoubleClick={onClick}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.label}>{name}</div>
    </div>
  );
}
