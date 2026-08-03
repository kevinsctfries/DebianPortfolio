import type { Terminal } from "@xterm/xterm";

export type TerminalContext = {
  cwd: string[];
  setCwd: (path: string[]) => void;
};

export type CommandFn = (
  term: Terminal,
  args: string[],
  ctx: TerminalContext,
) => Promise<void> | void;

export interface Command {
  name: string;
  description: string;
  run: CommandFn;
}

const commands = new Map<string, Command>();

export const registerCommand = (cmd: Command) => {
  commands.set(cmd.name, cmd);
};

export const getCommand = (name: string): Command | undefined =>
  commands.get(name);

export const getAllCommands = (): IterableIterator<Command> =>
  commands.values();

import help from "./help";
import clear from "./clear";
import whoami from "./whoami";
import cd from "./cd";
import ls from "./ls";

[help, clear, whoami, cd, ls].forEach(registerCommand);
