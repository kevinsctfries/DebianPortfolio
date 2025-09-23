"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import styles from "../apps.module.scss";
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

    const prompt = [
      { text: "kevin@portfolio", color: "#55ff55" },
      { text: ":" },
      { text: "~", color: "#4f4fed" },
      { text: "$ " },
    ];

    const renderPrompt = () => {
      prompt.forEach(part => {
        if (part.color) {
          const r = parseInt(part.color.slice(1, 3), 16);
          const g = parseInt(part.color.slice(3, 5), 16);
          const b = parseInt(part.color.slice(5, 7), 16);
          xterm.write(`\x1b[38;2;${r};${g};${b}m${part.text}\x1b[0m`);
        } else {
          xterm.write(part.text);
        }
      });
    };

    xterm.open(terminalRef.current);
    xterm.write(`Welcome to Kevin's Portfolio Terminal!\r\n`);
    renderPrompt();

    xterm.onData(e => {
      if (e === "\r") {
        xterm.write(`\r\n`);
        renderPrompt();
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
