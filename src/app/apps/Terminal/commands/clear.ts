import type { Terminal } from "@xterm/xterm";
import { type Command } from ".";

export default {
  name: "clear",
  description: "Clear the terminal",
  run: (term: Terminal) => {
    term.clear();
    term.write("\x1b[2J\x1b[;H");
    term.scrollToTop();
  },
} satisfies Command;
