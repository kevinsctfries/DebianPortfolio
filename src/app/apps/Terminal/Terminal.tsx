"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import styles from "./terminal.module.scss";

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const handleResizeRef = useRef<() => void>(() => {});

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!terminalRef.current || !mounted) return;
      if (xtermRef.current) return;

      const { FitAddon } = await import("@xterm/addon-fit");

      const xterm = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        lineHeight: 1.3,
        letterSpacing: 0,
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        theme: {
          background: "#1e1e1e",
          foreground: "#ffffff",
        },
      });

      const fitAddon = new FitAddon();
      xterm.loadAddon(fitAddon);
      xterm.open(terminalRef.current);
      xterm.focus();
      fitAddon.fit();

      xtermRef.current = xterm;
      fitAddonRef.current = fitAddon;

      handleResizeRef.current = () => fitAddonRef.current?.fit();
      window.addEventListener("resize", handleResizeRef.current);

      resizeObserverRef.current = new ResizeObserver(() => {
        fitAddonRef.current?.fit();
      });
      resizeObserverRef.current.observe(terminalRef.current);

      // custom prompt
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
    }

    init();

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResizeRef.current);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (xtermRef.current) {
        try {
          xtermRef.current.dispose();
        } catch {}
        xtermRef.current = null;
      }
      fitAddonRef.current = null;
    };
  }, []);

  return <div ref={terminalRef} className={styles.terminal} />;
}
