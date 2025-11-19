// src/app/apps/Terminal/commands/sudo.ts
import type { Terminal, IDisposable } from "@xterm/xterm";
import { type Command } from ".";

type InputFlag = { current: boolean };

export default {
  name: "sudo",
  description: "Elevate privileges (no)",
  run: (term: Terminal, args: string[], inputFlag?: InputFlag) => {
    return new Promise<void>(resolve => {
      if (args.length === 0) {
        term.writeln("usage: sudo -h | -K | -k | -V");
        term.writeln(
          "usage: sudo -v [-ABkNnS] [-g group] [-h host] [-p prompt] [-u user]"
        );
        term.writeln(
          "usage: sudo -l [-ABkNnS] [-g group] [-h host] [-p prompt] [-U user]"
        );
        term.writeln("            [-u user] [command [arg ...]]");
        term.writeln(
          "usage: sudo [-ABbEHkNnPS] [-r role] [-t type] [-C num] [-D directory]"
        );
        term.writeln(
          "            [-g group] [-h host] [-p prompt] [-R directory] [-T timeout]"
        );
        term.writeln(
          "            [-u user] [VAR=value] [-i | -s] [command [arg ...]]"
        );
        term.writeln(
          "usage: sudo -e [-ABkNnS] [-r role] [-t type] [-C num] [-D directory]"
        );
        term.writeln(
          "            [-g group] [-h host] [-p prompt] [-R directory] [-T timeout]"
        );
        term.writeln("            [-u user] file ...");
        resolve();
        return;
      }

      if (args[0] === "-h" || args[0] === "--help") {
        term.writeln("sudo - execute a command as another user");
        term.writeln("");
        term.writeln("usage: sudo -h | -K | -k | -V");
        term.writeln(
          "usage: sudo -v [-ABkNnS] [-g group] [-h host] [-p prompt] [-u user]"
        );
        term.writeln(
          "usage: sudo -l [-ABkNnS] [-g group] [-h host] [-p prompt] [-U user]"
        );
        term.writeln("            [-u user] [command [arg ...]]");
        term.writeln(
          "usage: sudo [-ABbEHkNnPS] [-r role] [-t type] [-C num] [-D directory]"
        );
        term.writeln(
          "            [-g group] [-h host] [-p prompt] [-R directory] [-T timeout]"
        );
        term.writeln(
          "            [-u user] [VAR=value] [-i | -s] [command [arg ...]]"
        );
        term.writeln(
          "usage: sudo -e [-ABkNnS] [-r role] [-t type] [-C num] [-D directory]"
        );
        term.writeln(
          "            [-g group] [-h host] [-p prompt] [-R directory] [-T timeout]"
        );
        term.writeln("            [-u user] file ...");
        term.writeln("");
        term.writeln("Options:");
        term.writeln(
          "  -A, --askpass                 use a helper program for password prompting"
        );
        term.writeln(
          "  -b, --background              run command in the background"
        );
        term.writeln(
          "  -B, --bell                    ring bell when prompting"
        );
        term.writeln(
          "  -C, --close-from=num          close all file descriptors >= num"
        );
        term.writeln(
          "  -D, --chdir=directory         change the working directory before running"
        );
        term.writeln("                                command");
        term.writeln(
          "  -E, --preserve-env            preserve user environment when running command"
        );
        term.writeln(
          "      --preserve-env=list       preserve specific environment variables"
        );
        term.writeln(
          "  -e, --edit                    edit files instead of running a command"
        );
        term.writeln(
          "  -g, --group=group             run command as the specified group name or ID"
        );
        term.writeln(
          "  -H, --set-home                set HOME variable to target user's home dir"
        );
        term.writeln(
          "  -h, --help                    display help message and exit"
        );
        term.writeln(
          "  -h, --host=host               run command on host (if supported by plugin)"
        );
        term.writeln(
          "  -i, --login                   run login shell as the target user; a command"
        );
        term.writeln("                                may also be specified");
        term.writeln(
          "  -K, --remove-timestamp        remove timestamp file completely"
        );
        term.writeln(
          "  -k, --reset-timestamp         invalidate timestamp file"
        );
        term.writeln(
          "  -l, --list                    list user's privileges or check a specific"
        );
        term.writeln(
          "                                command; use twice for longer format"
        );
        term.writeln(
          "  -n, --non-interactive         non-interactive mode, no prompts are used"
        );
        term.writeln(
          "  -P, --preserve-groups         preserve group vector instead of setting to"
        );
        term.writeln("                                target's");
        term.writeln(
          "  -p, --prompt=prompt           use the specified password prompt"
        );
        term.writeln(
          "  -R, --chroot=directory        change the root directory before running command"
        );
        term.writeln(
          "  -r, --role=role               create SELinux security context with specified"
        );
        term.writeln("                                role");
        term.writeln(
          "  -S, --stdin                   read password from standard input"
        );
        term.writeln(
          "  -s, --shell                   run shell as the target user; a command may"
        );
        term.writeln("                                also be specified");
        term.writeln(
          "  -t, --type=type               create SELinux security context with specified"
        );
        term.writeln("                                type");
        term.writeln(
          "  -T, --command-timeout=timeout terminate command after the specified time limit"
        );
        term.writeln(
          "  -U, --other-user=user         in list mode, display privileges for user"
        );
        term.writeln(
          "  -u, --user=user               run command (or edit file) as specified user"
        );
        term.writeln("                                name or ID");
        term.writeln(
          "  -V, --version                 display version information and exit"
        );
        term.writeln(
          "  -v, --validate                update user's timestamp without running a"
        );
        term.writeln("                                command");
        term.writeln(
          "  --                            stop processing command line arguments"
        );
        resolve();
        return;
      }

      if (args[0] === "-V" || args[0] === "--version") {
        term.writeln("Sudo version 1.9.15p5");
        term.writeln("Sudoers policy plugin version 1.9.15p5");
        term.writeln("Sudoers file grammar version 50");
        term.writeln("Sudoers I/O plugin version 1.9.15p5");
        term.writeln("Sudoers audit plugin version 1.9.15p5");
        resolve();
        return;
      }

      if (inputFlag) inputFlag.current = true;

      let listener: IDisposable | null = null;
      let password = "";

      term.write("\x1b[1;33m[sudo] password for kevin:\x1b[0m ");

      listener = term.onData(data => {
        if (data === "\r") {
          term.writeln("\r\n\x1b[31msudo: incorrect password\x1b[0m");
          term.writeln("\x1b[33mWhat do you think you're doing?\x1b[0m");

          if (inputFlag) inputFlag.current = false;
          listener?.dispose();
          resolve();
        } else if (data === "\u007F" && password.length > 0) {
          password = password.slice(0, -1);
          term.write("\b \b");
        } else if (data >= " " && data <= "~") {
          password += data;
          term.write("*");
        }
      });
    });
  },
} satisfies Command;
