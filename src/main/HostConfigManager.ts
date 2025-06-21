import { HostConfig } from '@/dts/host-config';
import { ipcMain } from 'electron';
import log from 'electron-log/main';

const devContainersHostConfig: HostConfig[] = [
  {
    id: '2',
    label: 'Dev Container 1',
    host: 'localhost',
    port: 2222,
    username: 'testuser',
    password: 'testpass'
  },
  {
    id: '3',
    label: 'Dev Container 2',
    host: 'localhost',
    port: 2223,
    username: 'testuser',
    password: 'testpass'
  }
];

/**
 * This class manages host configurations for terminal sessions.
 * It is responsible for storing, retrieving, and managing host configurations
 * that can be used to establish connections to remote hosts.
 */
export class HostConfigManager {
  static _instance: HostConfigManager;
  private hostConfigs: Map<string, HostConfig> = new Map();

  constructor() {
    log.info('[HostConfigManager] - Initializing HostConfigManager');
    // Initialize with some default host configurations
    devContainersHostConfig.forEach(config => {
      this.addHostConfig(config);
    });
    this.addIpcListeners();
  }

  public static get instance(): HostConfigManager {
    if (!HostConfigManager._instance) {
      HostConfigManager._instance = new HostConfigManager();
    }

    return HostConfigManager._instance;
  }

  public static init() {
    HostConfigManager._instance = new HostConfigManager();
  }

  public getHostConfigs(): HostConfig[] {
    return Array.from(this.hostConfigs.values());
  }

  public getHostConfig(id: string): HostConfig | undefined {
    return this.hostConfigs.get(id);
  }

  public addHostConfig(hostConfig: HostConfig): void {
    if (!hostConfig.id) {
      throw new Error('HostConfig must have an id');
    }
    // We can also add validation here to ensure the hostConfig is valid
    this.hostConfigs.set(hostConfig.id, hostConfig);
  }

  public removeHostConfig(id: string): void {
    this.hostConfigs.delete(id);
  }

  private addIpcListeners() {
    ipcMain.handle('hosts:getAll', () => {
      return { success: true, data: this.getHostConfigs() };
    });
    ipcMain.handle('hosts:getById', (_event, id: string) => {
      return { success: true, data: this.getHostConfig(id) };
    });
    ipcMain.handle('hosts:add', (_event, hostConfig: HostConfig) => {
      this.addHostConfig(hostConfig);
      return { success: true, data: hostConfig };
    });
    ipcMain.handle('hosts:remove', (_event, id: string) => {
      this.removeHostConfig(id);
      return { success: true };
    });
  }
}
