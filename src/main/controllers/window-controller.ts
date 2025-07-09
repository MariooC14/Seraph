import { app, BrowserWindow } from 'electron';
import { WindowManager } from '../service/window-service';
import { IpcController } from './ipc-controller';

export class WindowController extends IpcController {
  private window: BrowserWindow;

  constructor() {
    super('app');
    this.addHandler('minimize', () => this.minimize());
    this.addHandler('maximize', () => this.maximize());
    this.addHandler('unmaximize', () => this.unmaximize());
    this.addHandler('isMaximized', () => this.isMaximized());
    this.addHandler('exit', () => this.exit());
  }

  private minimize() {
    WindowManager.instance.mainWindow.minimize();
  }

  private maximize() {
    WindowManager.instance.mainWindow.maximize();
  }

  private unmaximize() {
    WindowManager.instance.mainWindow.unmaximize();
  }

  private isMaximized() {
    return WindowManager.instance.mainWindow.isMaximized();
  }

  sendMaximizedSignal(isMaximized: boolean) {
    this.window.webContents.send(`${this.baseChannel}:maximized`, isMaximized);
  }

  sendThemeChangedSignal(theme: string) {
    this.window.webContents.send(`${this.baseChannel}:themeChanged`, theme);
  }

  exit() {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      WindowManager.instance.closeMainWindow();
    }
  }

  setWindow(window: BrowserWindow) {
    this.window = window;
  }
}
