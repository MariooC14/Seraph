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
  }
}

export {};
