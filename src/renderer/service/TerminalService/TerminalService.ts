import { defaultTerminalOptions } from "@/components/TerminalWindow/terminalConfig";
import { TerminalSession } from "@/context/TerminalTabsProvider";
import { Terminal } from "@xterm/xterm";

export const TerminalService = {
  async createTerminalSession(shellPath: string): Promise<TerminalSession> {
    console.log("Creating new terminal with shell path:", shellPath);

    const term = new Terminal(defaultTerminalOptions);
    const promise = new Promise<TerminalSession>((resolve) => {
      window.terminal.onNewTerminalSession((sessionId: string) => {
        console.log("New terminal sessionId:", sessionId);
        resolve({ id: sessionId, terminal: term });
      });
    });

    window.terminal.spawnTerminal(shellPath);
    return promise;
  },
};
