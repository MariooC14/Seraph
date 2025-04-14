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

    windows: {
      applyTheme: (theme: Theme) => Promise<void>;
      onNativeThemeChanged: (callback: (theme: Theme) => void) => void;
    };
  }

  type Theme = "system" | "light" | "dark";
}

export {};
