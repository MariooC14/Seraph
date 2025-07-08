import { app } from 'electron';
import { WindowManager } from '../windowManager';
import { IpcController } from './ipc-controller';

export class WindowController extends IpcController {
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

  exit() {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      WindowManager.instance.closeMainWindow();
    }
  }
}
