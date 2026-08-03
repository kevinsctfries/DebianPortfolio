"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import styles from "./terminal.module.scss";
import { getCommand } from "./commands";
import { getAllCommands } from "./commands";
import {
  getDirEntries,
  resolvePath,
  HOME_PATH,
  formatPromptPath,
} from "@/app/utils/linux-fs";

import type { FitAddon } from "@xterm/addon-fit";
import type { TerminalContext } from "./commands";

const buildPrompt = (pathDisplay: string) =>
  "\x1b[0m" +
  "\x1b[38;2;85;255;85mkevin@portfolio\x1b[0m" +
  `:\x1b[38;2;79;79;237m${pathDisplay}\x1b[0m$ ` +
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
      fontFamily: "var(--font-mono), monospace",
    });

    import("@xterm/addon-fit").then(({ FitAddon }) => {
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddonRef.current = fitAddon;
      fitAddon.fit();

      document.fonts.ready.then(() => {
        fitAddon.fit();
      });
    });

    term.open(terminalRef.current);
    term.focus();

    term.clear();
    term.writeln("\x1b[1;36mWelcome to Kevin's Portfolio Terminal!\x1b[0m");
    term.writeln("");
    term.writeln("Type \x1b[1;33mhelp\x1b[0m for available commands.");
    term.writeln("");

    // current working directory, tracked as a path array
    let cwd: string[] = [...HOME_PATH];

    const renderPrompt = () => term.write(buildPrompt(formatPromptPath(cwd)));
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
      term.write(buildPrompt(formatPromptPath(cwd)));
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

    const longestCommonPrefix = (strings: string[]): string => {
      if (strings.length === 0) return "";
      let prefix = strings[0];
      for (const s of strings.slice(1)) {
        while (!s.startsWith(prefix)) {
          prefix = prefix.slice(0, -1);
          if (!prefix) return "";
        }
      }
      return prefix;
    };

    const completeInput = () => {
      // only complete when the cursor is at the end of the buffer
      if (cursorPos !== inputBuffer.length) return;

      const tokens = inputBuffer.split(" ");
      const isFirstToken = tokens.length === 1;
      const partial = tokens[tokens.length - 1];

      let matches: string[] = [];
      let replaceFrom = "";

      if (isFirstToken) {
        // completing a command name
        matches = Array.from(getAllCommands())
          .map((c) => c.name)
          .filter((name) => name.startsWith(partial));
      } else {
        // completing a file/directory argument
        const lastSlash = partial.lastIndexOf("/");
        const dirPart = lastSlash >= 0 ? partial.slice(0, lastSlash) : "";
        const namePart =
          lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial;

        const dirPath =
          dirPart === "" ? cwd : resolvePath(cwd, dirPart || undefined);

        replaceFrom = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : "";

        matches = getDirEntries(dirPath)
          .filter((entry) => entry.name.startsWith(namePart))
          .map((entry) =>
            entry.type === "directory" ? `${entry.name}/` : entry.name,
          );
      }

      if (matches.length === 0) {
        term.write("\x07");
        return;
      }

      const rawPartial = isFirstToken
        ? partial
        : partial.slice(replaceFrom.length);
      const completed =
        matches.length === 1 ? matches[0] : longestCommonPrefix(matches);

      if (completed.length <= rawPartial.length) {
        term.writeln("");
        term.writeln(matches.join("   "));
        renderPrompt();
        term.write(inputBuffer);
        return;
      }

      const newLastToken = isFirstToken ? completed : replaceFrom + completed;
      tokens[tokens.length - 1] = newLastToken;
      const newBuffer = tokens.join(" ");

      const added = newBuffer.slice(inputBuffer.length);
      inputBuffer = newBuffer;
      cursorPos = inputBuffer.length;
      term.write(added);
    };

    term.onData((data) => {
      if (busy) return; // ignore keystrokes while a command is running

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
              const ctx: TerminalContext = {
                cwd,
                setCwd: (newPath) => {
                  cwd = newPath;
                },
              };

              busy = true;
              Promise.resolve(cmd.run(term, args, ctx))
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
              return; // dont fall through to the shared prompt render below
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

        case "\t": // tab
          completeInput();
          return;

        default:
          // printable characters and tab. ignore other escape sequences/control codes
          if (data >= " ") {
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
