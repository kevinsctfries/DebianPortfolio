"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import styles from "../styles/apps.module.scss";
import "./xterm.css";

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const xterm = new XTerm({
      cols: 80,
      rows: 24,
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    xterm.open(terminalRef.current);
    xterm.write("Welcome to Kevin's Portfolio Terminal!\r\n$ ");

    xterm.onData(e => {
      if (e === "\r") {
        xterm.write("\r\n$ ");
      } else if (e === "\u007F") {
        xterm.write("\b \b");
      } else {
        xterm.write(e);
      }
    });

    xtermRef.current = xterm;

    return () => {
      xterm.dispose();
    };
  }, []);

  return <div ref={terminalRef} className={styles.terminal}></div>;
}
