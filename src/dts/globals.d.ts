declare global {
  interface BaseIPCResponse {
    success: boolean;
  }

  interface SuccessResponse<T = void> extends BaseIPCResponse {
    success: true;
    data: T;
  }

  interface ErrorResponse extends BaseIPCResponse {
    success: false;
    error: string;
    code?: string;
  }

  type IPCResponse<T = void> = SuccessResponse<T> | ErrorResponse;
  type IPCPromise<T = void> = Promise<IPCResponse<T>>;

  interface Window {
    terminal: {
      createLocalSession: (shellPath: string) => Promise<string>;
      createSSHSession: (hostId: string) => IPCPromise<string>;
      resizeTerminal: (sessionId: string, cols: number, rows: number) => IPCPromise<void>;
      terminateSession: (sessionId: string) => IPCPromise<void>;
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

    hosts: {
      getAll: () => IPCPromise<HostConfig[]>;
      get: (id: string) => IPCPromise<HostConfig | undefined>;
      add: (host: HostConfig) => IPCPromise<HostConfig>;
      remove: (id: string) => IPCPromise<void>;
    };
  }

  type Theme = 'system' | 'light' | 'dark';
}

export {};
