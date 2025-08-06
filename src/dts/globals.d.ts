declare global {
  interface BaseIPCResponse {
    success: boolean;
  }

  interface SuccessResponse<T = void> extends BaseIPCResponse {
    success: true;
    data: T;
  }

  interface ErrorResponse<E = void> extends BaseIPCResponse {
    success: false;
    code?: string;
    message: string;
    details?: E;
  }

  type IPCResponse<T = void, E = void> = SuccessResponse<T> | ErrorResponse<E>;
  type IPCPromise<T = void, E = void> = Promise<IPCResponse<T, E>>;

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
      exit(): typeof ipcRenderer.invoke;
      maximize: () => void;
      unmaximize: () => void;
      minimize: () => void;
      onMaximized: (callback: (maximized: boolean) => void) => void;
      isMaximized: () => Promise<boolean>;
      onNativeThemeChanged: (callback: (theme: Theme) => void) => void;
      isMacOS: () => boolean;
    };

    hosts: {
      getAll: () => IPCPromise<HostConfig[]>;
      get: (id: string) => IPCPromise<HostConfig | undefined>;
      add: (host: Omit<HostConfig, 'id'>) => IPCPromise<HostConfig>;
      remove: (id: string) => IPCPromise<void>;
      update: (host: HostConfig) => IPCPromise<HostConfig>;
    };

    sshSetup: {
      connect: (sessionId: string) => IPCPromise<boolean>;
      requestPty: (sessionId: string) => IPCPromise<void>;
      setUsername: (sessionId: string, username: string, save?: boolean) => IPCPromise<void>;
      setPassword: (sessionId: string, password: string, save?: boolean) => IPCPromise<void>;
    };

    network: {
      ping: (address: string, port?: number) => IPCPromise<boolean, { messages: string[] }>;
    };
  }

  type Theme = 'system' | 'light' | 'dark';
}

export {};
