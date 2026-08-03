import type { Terminal } from "@xterm/xterm";
import { type Command, type TerminalContext } from ".";
import { getNodeAtPath, resolvePath } from "@/app/utils/linux-fs";
import { fetchBlobContent } from "@/app/utils/github";

const MAX_LINES = 1000; // guard against flooding scrollback on huge files

export default {
  name: "cat",
  description: "Print file contents",
  run: async (term: Terminal, args: string[], ctx: TerminalContext) => {
    const pathArg = args[0];

    if (!pathArg) {
      term.writeln("\x1b[31mcat: missing file operand\x1b[0m");
      return;
    }

    const targetPath = resolvePath(ctx.cwd, pathArg);
    const node = getNodeAtPath(targetPath);

    if (!node) {
      term.writeln(`\x1b[31mcat: ${pathArg}: No such file or directory\x1b[0m`);
      return;
    }

    if (node.type === "directory") {
      term.writeln(`\x1b[31mcat: ${pathArg}: Is a directory\x1b[0m`);
      return;
    }

    if (!node.owner || !node.repo || !node.sha) {
      // local/static filesystem entries have no real backing content
      term.writeln(`\x1b[2m${node.description}\x1b[0m`);
      return;
    }

    try {
      const content = await fetchBlobContent(node.owner, node.repo, node.sha);
      const lines = content.split("\n").map((l) => l.replace(/\r$/, ""));

      const truncated = lines.length > MAX_LINES;
      const toPrint = truncated ? lines.slice(0, MAX_LINES) : lines;

      for (const line of toPrint) {
        term.writeln(line);
      }

      if (truncated) {
        term.writeln(
          `\x1b[2m... truncated (${lines.length - MAX_LINES} more lines)\x1b[0m`,
        );
      }
    } catch (err) {
      term.writeln(
        `\x1b[31mcat: ${pathArg}: ${
          err instanceof Error ? err.message : "Failed to load file"
        }\x1b[0m`,
      );
    }
  },
} satisfies Command;
