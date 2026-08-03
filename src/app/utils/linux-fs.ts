import linuxFSJson from "@/app/data/linux-fs.json";
import type { FileNode } from "@/app/apps/FileExplorer/FileExplorer";

export const linuxFS = linuxFSJson as Record<string, FileNode>;

export const HOME_PATH = ["/", "home", "Kevin"];

export function getNodeAtPath(pathArr: string[]): FileNode | null {
  if (!pathArr || pathArr.length === 0) return null;

  let node: FileNode | undefined = linuxFS["/"];
  if (!node) return null;

  for (let i = 1; i < pathArr.length; i++) {
    if (!node.contents) return null;
    node = node.contents[pathArr[i]];
    if (!node) return null;
  }

  return node ?? null;
}

// resolves a cd-style argument (relative, absolute, "..", ".", "~", or empty) against the current working directory into an absolute path array.
export function resolvePath(cwd: string[], input?: string): string[] {
  if (!input || input === "~") return [...HOME_PATH];

  let base: string[];
  let rest: string;

  if (input.startsWith("~/")) {
    base = [...HOME_PATH];
    rest = input.slice(2); // strip the "~/"
  } else if (input.startsWith("/")) {
    base = ["/"];
    rest = input;
  } else {
    base = [...cwd];
    rest = input;
  }

  for (const segment of rest.split("/").filter(Boolean)) {
    if (segment === ".") continue;
    if (segment === "..") {
      if (base.length > 1) base.pop();
      continue;
    }
    base.push(segment);
  }

  return base;
}

// formats a path for prompt display, collapsing the home dir to "~"
export function formatPromptPath(cwd: string[]): string {
  const inHome = HOME_PATH.every((seg, i) => cwd[i] === seg);
  if (inHome) {
    const rest = cwd.slice(HOME_PATH.length);
    return rest.length === 0 ? "~" : `~/${rest.join("/")}`;
  }
  return cwd.length === 1 ? "/" : "/" + cwd.slice(1).join("/");
}

export function getDirEntries(
  pathArr: string[],
): { name: string; type: "file" | "directory" }[] {
  const node = getNodeAtPath(pathArr);
  if (!node || node.type !== "directory" || !node.contents) return [];

  return Object.entries(node.contents).map(([name, child]) => ({
    name,
    type: child.type,
  }));
}
