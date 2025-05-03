import {ClientTerminalSession} from '@/service/TerminalService/ClientTerminalSession';

export const TerminalService = {
  async createTerminalSession(
    shellPath: string
  ): Promise<ClientTerminalSession | never> {
    console.log("Creating new terminal with shell path:", shellPath);

    return await window.terminal
      .createSession(shellPath)
      .then((sessionId: string) => {
        console.log("New terminal sessionId:", sessionId);
        return new ClientTerminalSession(sessionId);
      })
      .catch((error) => {
        console.error("Failed to create terminal session:", error);
        throw error;
      });
  },
};
