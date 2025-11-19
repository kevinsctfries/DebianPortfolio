import type { Terminal } from "@xterm/xterm";
import { type Command } from ".";
import linuxFSJson from "@/app/data/linux-fs.json";

type FileNode =
  | {
      type: "file";
      description: string;
    }
  | {
      type: "directory";
      description: string;
      contents?: Record<string, FileNode>;
      link?: string;
    };

type LinuxFS = Record<string, FileNode>;

const linuxFS = linuxFSJson as LinuxFS;

let cwd = "/home/Kevin";

export const getCwd = (): string => cwd;
export const setCwd = (path: string): void => {
  cwd = normalizePath(path);
};

function normalizePath(target: string): string {
  if (target.startsWith("~")) {
    target = target.replace("~", "/home/Kevin");
  }

  if (!target.startsWith("/")) {
    const base = cwd.endsWith("/") ? cwd.slice(0, -1) : cwd;
    target = base + "/" + target;
  }

  const parts = target.split("/").filter(Boolean);
  const stack: string[] = [];

  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  const result = "/" + stack.join("/");
  return result === "/" ? "/" : result;
}

function pathExists(path: string): boolean {
  const resolved = normalizePath(path);
  if (resolved === "/") return true;

  const segments = resolved.split("/").filter(Boolean);
  let current: FileNode | undefined = linuxFS["/"];

  for (const seg of segments) {
    if (
      !current ||
      current.type !== "directory" ||
      !current.contents ||
      !(seg in current.contents)
    ) {
      return false;
    }
    current = current.contents[seg];
  }

  return current?.type === "directory";
}

export default {
  name: "cd",
  description: "Change directory",
  run: (term: Terminal, args: string[]) => {
    const target = args.join(" ").trim() || "~";

    if (target === "-") {
      term.writeln("\x1b[31mcd: OLDPWD not set\x1b[0m");
      return;
    }

    if (!pathExists(target)) {
      term.writeln(`\x1b[31mcd: no such file or directory: ${target}\x1b[0m`);
      return;
    }

    setCwd(target);
  },
} satisfies Command;
