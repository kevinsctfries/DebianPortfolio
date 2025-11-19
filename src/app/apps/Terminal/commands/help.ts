import type { Terminal } from "@xterm/xterm";
import { getAllCommands, type Command } from ".";

const help = {
  name: "help",
  description: "Show this help message",
  run: (term: Terminal) => {
    term.writeln("\x1b[1;33mAvailable commands:\x1b[0m");
    term.writeln("");
    for (const cmd of getAllCommands()) {
      term.writeln(`  \x1b[1;36m${cmd.name.padEnd(14)}`);
    }
    term.writeln("");
  },
} satisfies Command;

export default help;
