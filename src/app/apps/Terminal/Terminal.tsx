"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import styles from "./terminal.module.scss";
import { getCommand } from "./commands";

const PROMPT =
  "\x1b[0m" +
  "\x1b[38;2;85;255;85mkevin@portfolio\x1b[0m" +
  ":\x1b[38;2;79;79;237m~\x1b[0m$ " +
  "\x1b[0m";

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

    const renderPrompt = () => term.write(PROMPT);
    renderPrompt();

    // line state
    let inputBuffer = "";
    let cursorPos = 0;

    // history state
    const history: string[] = [];
    let historyIndex = -1; // -1 means "not browsing history"
    let draftBeforeHistory = "";

    // prevents input from being processed while a command is still running
    let busy = false;

    const redrawLine = () => {
      // \x1b[2K clears the whole line, \r returns to column 0
      term.write("\x1b[2K\r");
      term.write(PROMPT);
      term.write(inputBuffer);
      const moveLeft = inputBuffer.length - cursorPos;
      if (moveLeft > 0) term.write(`\x1b[${moveLeft}D`);
    };

    const resetLine = () => {
      inputBuffer = "";
      cursorPos = 0;
      historyIndex = -1;
      draftBeforeHistory = "";
    };

    term.onData((data) => {
      if (busy) return;

      const atEnd = cursorPos === inputBuffer.length;

      switch (data) {
        case "\r": {
          const fullLine = inputBuffer.trim();
          term.writeln("");

          if (fullLine) {
            history.push(fullLine);
            const [cmdName, ...args] = fullLine.split(" ");
            const cmd = getCommand(cmdName);

            if (cmd) {
              busy = true;
              Promise.resolve(cmd.run(term, args))
                .catch((err) => {
                  term.writeln(
                    `\x1b[31mError: ${err?.message || "Command failed"}\x1b[0m`,
                  );
                })
                .finally(() => {
                  busy = false;
                  term.writeln("");
                  renderPrompt();
                });
              resetLine();
              return;
            } else {
              term.writeln(`\x1b[31mCommand not found: ${cmdName}\x1b[0m`);
            }
          }

          resetLine();
          term.writeln("");
          renderPrompt();
          return;
        }

        case "\u007F": // backspace
          if (cursorPos > 0) {
            inputBuffer =
              inputBuffer.slice(0, cursorPos - 1) +
              inputBuffer.slice(cursorPos);
            cursorPos--;

            if (atEnd) {
              term.write("\b \b");
            } else {
              redrawLine();
            }
          }
          return;

        case "\u0003": // Ctrl+C
          term.writeln("^C");
          resetLine();
          renderPrompt();
          return;

        case "\u000c": // Ctrl+L
          term.clear();
          renderPrompt();
          term.write(inputBuffer);
          return;

        case "\x1b[A": // up
          if (history.length === 0) return;
          if (historyIndex === -1) {
            draftBeforeHistory = inputBuffer;
            historyIndex = history.length - 1;
          } else if (historyIndex > 0) {
            historyIndex--;
          }
          inputBuffer = history[historyIndex];
          cursorPos = inputBuffer.length;
          redrawLine();
          return;

        case "\x1b[B": // down
          if (historyIndex === -1) return;
          if (historyIndex < history.length - 1) {
            historyIndex++;
            inputBuffer = history[historyIndex];
          } else {
            historyIndex = -1;
            inputBuffer = draftBeforeHistory;
          }
          cursorPos = inputBuffer.length;
          redrawLine();
          return;

        case "\x1b[C": // right
          if (cursorPos < inputBuffer.length) {
            cursorPos++;
            term.write("\x1b[C");
          }
          return;

        case "\x1b[D": // left
          if (cursorPos > 0) {
            cursorPos--;
            term.write("\x1b[D");
          }
          return;

        default:
          if (data >= " " || data === "\t") {
            inputBuffer =
              inputBuffer.slice(0, cursorPos) +
              data +
              inputBuffer.slice(cursorPos);
            cursorPos += data.length;

            if (atEnd) {
              term.write(data);
            } else {
              redrawLine();
            }
          }
          return;
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
