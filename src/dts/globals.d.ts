declare global {
  interface Window {
    terminal: {
      spawnTerminal: () => void;
      sendData: (data: string) => void;
      onData: (callback: (data: string) => void) => void;
    };
  }
}

export {};
