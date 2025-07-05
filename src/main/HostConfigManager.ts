import { HostConfig } from '@/dts/host-config';
import { ipcMain } from 'electron';
import log from 'electron-log/main';
import { StorageManager } from './StorageManager';
import { v4 as uuidv4 } from 'uuid';

/**
 * This class manages host configurations for terminal sessions.
 * It is responsible for storing, retrieving, and managing host configurations
 * that can be used to establish connections to remote hosts.
 */
export class HostConfigManager {
  static _instance: HostConfigManager;
  private hostConfigs: Map<string, HostConfig> = new Map();
  private hostsLoaded = false;

  constructor() {
    log.info('[HostConfigManager] - Initializing HostConfigManager');
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
    if (!this.hostsLoaded) {
      this.loadHostsFromStorage();
    }
    return Array.from(this.hostConfigs.values());
  }

  public getHostConfig(id: string): HostConfig | undefined {
    if (!this.hostsLoaded) {
      this.loadHostsFromStorage();
    }
    return this.hostConfigs.get(id);
  }

  public addHostConfig(hostConfig: Omit<HostConfig, 'id'>): HostConfig {
    const newHostId = uuidv4();
    const newHostConfig: HostConfig = {
      ...hostConfig,
      id: newHostId
    };
    // We can also add validation here to ensure the hostConfig is valid
    this.hostConfigs.set(newHostId, newHostConfig);
    log.info(`[HostConfigManager] - Added new host config with id: ${newHostId}`);
    StorageManager.instance.saveHosts(this.getHostConfigs());
    return newHostConfig;
  }

  public removeHostConfig(id: string): void {
    this.hostConfigs.delete(id);
    log.info(`[HostConfigManager] - Removed host config with id: ${id}`);
    StorageManager.instance.saveHosts(this.getHostConfigs());
  }

  private loadHostsFromStorage() {
    log.info('[HostConfigManager] - Loading host configurations');
    StorageManager.instance.getHosts().forEach(hostConfig => {
      this.hostConfigs.set(hostConfig.id, hostConfig);
    });
    this.hostsLoaded = true;
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
