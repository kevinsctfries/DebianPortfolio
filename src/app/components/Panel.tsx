"use client";

import { useState } from "react";
import styles from "../styles/panel.module.scss";
import Menu from "./Menu";

export default function Panel() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.panel}>
      <button
        className={styles.menuButton}
        onClick={() => {
          console.log("Panel menu button clicked, before:", menuOpen);
          setMenuOpen(!menuOpen);
        }}>
        🐭
      </button>

      {menuOpen && (
        <Menu
          onClose={() => {
            console.log("Closing menu");
            setMenuOpen(false);
          }}
        />
      )}
    </div>
  );
}
