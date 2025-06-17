export interface HostConfig {
  id: string;
  label: string;
  // The host address, e.g., 'localhost', '192.168.1.1
  host: string;
  port: number;
  username?: string;
  password?: string;

  // New fields for SSH integration
  source: 'manual' | 'ssh-config';
  identityFile?: string;
  configPath?: string;
}

export interface SSHHostConfig {
  host: string;
  hostname?: string;
  user?: string;
  port?: number;
  identityFile?: string; // Private key
  configPath: string; // Filepath, e.g.  $HOST/.ssh/config
}

export type HostStatus = 'available' | 'pending' | 'unavailable';
