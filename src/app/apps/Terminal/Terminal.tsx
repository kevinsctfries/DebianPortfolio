"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import styles from "./terminal.module.scss";
import { getCommand } from "./commands";

export default function TerminalComponent() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 16,
    });

    import("@xterm/addon-fit").then(({ FitAddon }) => {
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddonRef.current = fitAddon;
      fitAddon.fit();
    });

    term.open(terminalRef.current);
    term.focus();

    term.clear();
    term.writeln("\x1b[1;36mWelcome to Kevin's Portfolio Terminal!\x1b[0m");
    term.writeln("");
    term.writeln("Type \x1b[1;33mhelp\x1b[0m for available commands.");
    term.writeln("");

    const PROMPT =
      "\x1b[0m" +
      "\x1b[38;2;85;255;85mkevin@portfolio\x1b[0m" +
      ":\x1b[38;2;79;79;237m~\x1b[0m$ " +
      "\x1b[0m";

    const renderPrompt = () => {
      term.write(PROMPT);
    };

    renderPrompt();

    let inputBuffer = "";

    term.onData(data => {
      if (data === "\r") {
        const fullLine = inputBuffer.trim();

        term.writeln("");

        if (fullLine) {
          const [cmdName, ...args] = fullLine.split(" ");
          const cmd = getCommand(cmdName);

          if (cmd) {
            Promise.resolve(cmd.run(term, args)).catch(err => {
              term.writeln(
                `\x1b[31mError: ${err.message || "Command failed"}\x1b[0m`
              );
            });
          } else {
            term.writeln(`\x1b[31mCommand not found: ${cmdName}\x1b[0m`);
          }
        }

        inputBuffer = "";
        term.writeln("");
        renderPrompt();
      } else if (data === "\u007F") {
        if (inputBuffer.length > 0) {
          term.write("\b \b");
          inputBuffer = inputBuffer.slice(0, -1);
        }
      } else if (data >= " " || data === "\t") {
        term.write(data);
        inputBuffer += data;
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddonRef.current?.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      fitAddonRef.current = null;
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} className={styles.terminal} />;
}
