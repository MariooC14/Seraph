import { app, BrowserWindow } from 'electron';
import { WindowService } from '../service/window-service';
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
    WindowService.instance.mainWindow.minimize();
  }

  private maximize() {
    WindowService.instance.mainWindow.maximize();
  }

  private unmaximize() {
    WindowService.instance.mainWindow.unmaximize();
  }

  private isMaximized() {
    return WindowService.instance.mainWindow.isMaximized();
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
      WindowService.instance.closeMainWindow();
    }
  }

  setWindow(window: BrowserWindow) {
    this.window = window;
  }
}
