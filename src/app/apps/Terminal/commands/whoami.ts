// commands/whoami.ts
import type { Terminal } from "@xterm/xterm";
import { type Command } from ".";

export default {
  name: "whoami",
  description: "Display current user",
  run: (term: Terminal) => {
    term.writeln("kevin");
  },
} satisfies Command;
