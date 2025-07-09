import { HostConfig } from '@/dts/host-config';
import { StorageManager } from '../StorageManager';
import { v4 as uuidv4 } from 'uuid';

/**
 * This class manages host configurations for terminal sessions
 * that can be used to establish connections to remote hosts.
 */
export class HostsService {
  static _instance: HostsService;
  private hostConfigs: Map<string, HostConfig> = new Map();
  private hostsLoaded = false;

  constructor() {}

  public static get instance(): HostsService {
    if (!HostsService._instance) {
      HostsService._instance = new HostsService();
    }

    return HostsService._instance;
  }

  public static init() {
    HostsService._instance = new HostsService();
  }

  public getHosts(): HostConfig[] {
    if (!this.hostsLoaded) {
      this.loadHostsFromStorage();
    }
    return Array.from(this.hostConfigs.values());
  }

  public getHostById(id: string): HostConfig | undefined {
    if (!this.hostsLoaded) {
      this.loadHostsFromStorage();
    }
    return this.hostConfigs.get(id);
  }

  public addHost(hostConfig: Omit<HostConfig, 'id'>): HostConfig {
    const newHostId = uuidv4();
    const newHostConfig: HostConfig = {
      ...hostConfig,
      id: newHostId
    };
    this.hostConfigs.set(newHostId, newHostConfig);
    const saved = StorageManager.instance.saveHosts(this.getHosts());
    if (saved) {
      return newHostConfig;
    } else {
      throw new Error('Failed to save host configuration');
    }
  }

  public removeHost(id: string): void {
    this.hostConfigs.delete(id);
    StorageManager.instance.saveHosts(this.getHosts());
  }

  private loadHostsFromStorage() {
    StorageManager.instance.getHosts().forEach(hostConfig => {
      this.hostConfigs.set(hostConfig.id, hostConfig);
    });
    this.hostsLoaded = true;
  }
}
