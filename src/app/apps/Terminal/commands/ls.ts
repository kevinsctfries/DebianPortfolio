import type { Terminal } from "@xterm/xterm";
import { type Command, type TerminalContext } from ".";
import {
  getNodeAtPath,
  resolvePath,
  getDirEntries,
} from "@/app/utils/linux-fs";

const DIR_COLOR = "\x1b[1;34m";
const RESET = "\x1b[0m";

export default {
  name: "ls",
  description: "List directory contents",
  run: (term: Terminal, args: string[], ctx: TerminalContext) => {
    const showHidden = args.some((a) => a.startsWith("-") && a.includes("a"));
    const pathArg = args.find((a) => !a.startsWith("-"));

    const targetPath = pathArg ? resolvePath(ctx.cwd, pathArg) : ctx.cwd;
    const node = getNodeAtPath(targetPath);

    if (!node) {
      term.writeln(
        `\x1b[31mls: cannot access '${pathArg}': No such file or directory\x1b[0m`,
      );
      return;
    }

    if (node.type === "file") {
      term.writeln(pathArg ?? "");
      return;
    }

    let entries = getDirEntries(targetPath);

    if (!showHidden) {
      entries = entries.filter((e) => !e.name.startsWith("."));
    }

    if (entries.length === 0) return; // real ls prints nothing for an empty dir

    entries.sort((a, b) => a.name.localeCompare(b.name));

    const formatted = entries.map((e) =>
      e.type === "directory" ? `${DIR_COLOR}${e.name}${RESET}` : e.name,
    );

    term.writeln(formatted.join("  "));
  },
} satisfies Command;
