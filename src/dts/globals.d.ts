declare global {
  interface Window {
    terminal: {
      createLocalSession: (shellPath: string) => Promise<string | never>;
      createSSHSession: () => Promise<string | never>;
      resizeTerminal: (sessionId: string, cols: number, rows: number) => void;
      terminateSession: (sessionId: string) => void;
      onSessionTerminated: (sessionId: string, callback: (code: string) => void) => void;
      sendData: (sessionId: string, data: string) => void;
      onData: (sessionId: string, callback: (data: string) => void) => void;
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
      isMacOS: () => boolean;
    };
  }

  type Theme = 'system' | 'light' | 'dark';
}

export {};
