export interface HostConfig {
  id: string;
  label: string;
  // The host address, e.g., 'localhost', '192.168.1.1
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export type HostStatus = 'available' | 'pending' | 'unavailable';
