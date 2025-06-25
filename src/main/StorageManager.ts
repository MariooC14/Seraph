import log from 'electron-log/main';
import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'path';

const defaultUserConfig: UserConfig = {
  theme: 'dark',
  windowConfig: {
    width: 800,
    height: 600,
    maximized: false,
    x: undefined,
    y: undefined
  },
  preferredShell:
    process.env.SHELL || (process.platform === 'win32' ? 'powershell.exe' : '/bin/bash')
};

const userDataPath = app.getPath('userData');
const userConfigPath = path.join(userDataPath, 'user-config.json');

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

  public saveMainWindowConfig(window: BrowserWindow) {
    log.info('Saving main window configuration');
    const { x, y, width, height } = window.getBounds();
    this.saveUserConfig({
      ...this.getUserConfig(),
      windowConfig: { x, y, width, height, maximized: window.isMaximized() }
    });
  }
}
