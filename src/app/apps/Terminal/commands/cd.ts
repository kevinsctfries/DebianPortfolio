import type { Terminal } from "@xterm/xterm";
import { type Command, type TerminalContext } from ".";
import { getNodeAtPath, resolvePath } from "@/app/utils/linux-fs";

export default {
  name: "cd",
  description: "Change the current directory",
  run: (term: Terminal, args: string[], ctx: TerminalContext) => {
    const target = args[0];
    const newPath = resolvePath(ctx.cwd, target);
    const node = getNodeAtPath(newPath);

    if (!node) {
      term.writeln(`\x1b[31mcd: no such file or directory: ${target}\x1b[0m`);
      return;
    }

    if (node.type !== "directory") {
      term.writeln(`\x1b[31mcd: not a directory: ${target}\x1b[0m`);
      return;
    }

    ctx.setCwd(newPath);
  },
} satisfies Command;
