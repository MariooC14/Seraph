declare global {
  interface Window {
    terminal: {
      spawnTerminal: (string) => string;
      onNewTerminalSession: (callback: (sessionId: string) => void) => void;
      killTerminal: (sessionId: string) => void;
      sendData: (event: ClientWriteEvent) => void;
      onData: (callback: (data: TerminalDataEvent) => void) => void;
      getUserPreferredShell: () => Promise<string>;
      getAvailableShells: () => Promise<string[]>;
      saveDefaultShell: (newShellPath: string) => Promise<boolean>;
    };

    app: {
      exit(): () => void;
      maximize: () => void;
      unmaximize: () => void;
      minimize: () => void;
      onMaximized: (callback: (maximized: boolean) => void) => void;
      onNativeThemeChanged: (callback: (theme: Theme) => void) => void;
    };
  }

  type Theme = "system" | "light" | "dark";

  type TerminalDataEvent = {
    newData: string;
    sessionId: string;
  };

  type ClientWriteEvent = {
    sessionId: string;
    newData: string;
  };
}

export {};
