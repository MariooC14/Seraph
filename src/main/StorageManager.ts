import log from 'electron-log/main';
import { app } from 'electron';
import fs from 'node:fs';
import path from 'path';
import { isWindows } from './helpers';
import { WindowManager } from './service/window-service';
import { HostConfig } from '@/dts/host-config';

const defaultUserConfig: UserConfig = {
  theme: 'dark',
  windowConfig: {
    width: 800,
    height: 600,
    maximized: false,
    x: undefined,
    y: undefined
  },
  preferredShell: process.env.SHELL || (isWindows() ? 'powershell.exe' : '/bin/bash')
};

const userDataPath = app.getPath('userData');
const userConfigPath = path.join(userDataPath, 'user-config.json');
const hostsPath = path.join(userDataPath, 'hosts.json');

export class StorageManager {
  private static _instance?: StorageManager;

  constructor() {}

  static init() {
    this._instance = new StorageManager();
  }

  static get instance(): StorageManager {
    if (!this._instance) {
      this._instance = new StorageManager();
    }
    return this._instance;
  }

  public saveUserConfig(config: UserConfig) {
    try {
      fs.writeFileSync(userConfigPath, JSON.stringify(config, null, 2), 'utf-8');
      return true;
    } catch (error) {
      log.error('Error saving user config:', error);
      return false;
    }
  }

  public getUserConfig() {
    if (!fs.existsSync(userConfigPath)) {
      this.saveUserConfig(defaultUserConfig);
      return defaultUserConfig;
    }

    try {
      const data = fs.readFileSync(userConfigPath, 'utf-8');
      return JSON.parse(data) as UserConfig;
    } catch (error) {
      log.error('Error reading user config:', error);
      return defaultUserConfig;
    }
  }

  public saveMainWindowConfig() {
    log.info('Saving main window configuration');
    this.saveUserConfig({
      ...this.getUserConfig(),
      windowConfig: WindowManager.instance.getMainWindowConfig()
    });
  }

  public getHosts(): HostConfig[] {
    if (!fs.existsSync(hostsPath)) {
      return [];
    }

    try {
      const data = fs.readFileSync(hostsPath, 'utf-8');
      return JSON.parse(data) as HostConfig[];
    } catch (error) {
      log.error('Error reading hosts:', error);
      return [];
    }
  }

  public saveHosts(hosts: HostConfig[]) {
    try {
      fs.writeFileSync(hostsPath, JSON.stringify(hosts, null, 2), 'utf-8');
      return true;
    } catch (error) {
      log.error('Error saving hosts:', error);
      return false;
    }
  }
}
