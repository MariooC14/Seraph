import electron from 'electron';
import log from 'electron-log/main';

export class WindowManager {
  platform: NodeJS.Platform = process.platform;

  constructor(private _mainWindow: Electron.BrowserWindow) {}

  startListening() {
    electron.nativeTheme.on('updated', () => {
      log.info('windowManager: nativeTheme updated');
      const theme = electron.nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
      this._mainWindow.webContents.send('app:nativeThemeChanged', theme);
    });
  }

  get mainWindow() {
    return this._mainWindow;
  }

  set mainWindow(window: Electron.BrowserWindow) {
    this._mainWindow = window;
  }
}
