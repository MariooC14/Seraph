declare global {
  interface Window {
    terminal: {
      spawnTerminal: (string) => void;
      killTerminal: () => void;
      sendData: (data: string) => void;
      onData: (callback: (data: string) => void) => void;
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
}

export {};
