import { defaultTerminalOptions } from "@/components/TerminalWindow/terminalConfig";
import { TerminalSession } from "@/context/TerminalTabsProvider";
import { Terminal } from "@xterm/xterm";

export const TerminalService = {
  async createTerminalSession(
    shellPath: string
  ): Promise<TerminalSession | never> {
    console.log("Creating new terminal with shell path:", shellPath);

    return await window.terminal
      .createSession(shellPath)
      .then((sessionId: string) => {
        console.log("New terminal sessionId:", sessionId);
        const term = new Terminal(defaultTerminalOptions);
        return { id: sessionId, terminal: term };
      })
      .catch((error) => {
        console.error("Failed to create terminal session:", error);
        throw error;
      });
  },
};
