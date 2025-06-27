import electron, { BrowserWindow } from 'electron';
import {
  installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import path from 'node:path';
import log from 'electron-log/main';
import { StorageManager } from './StorageManager';

export class WindowManager {
  private static _instance?: WindowManager;
  private _mainWindow: BrowserWindow;

  constructor() {}

  static init() {
    this._instance = new WindowManager();
    this._instance.startListening();
  }

  public static get instance(): WindowManager {
    if (!this._instance) {
      this.init();
    }
    return this._instance;
  }

  public createMainWindow() {
    log.info('Creating main window');
    const { windowConfig } = StorageManager.instance.getUserConfig();
    this._mainWindow = new BrowserWindow({
      ...windowConfig,
      minWidth: 500,
      minHeight: 500,
      backgroundColor: 'rgba(10,10,10,0.5)',
      titleBarStyle: 'hidden',
      trafficLightPosition: { x: 10, y: 12 },
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });

    this._mainWindow.on('maximize', () => {
      this._mainWindow.webContents.send('app:maximized', true);
    });
    this._mainWindow.on('unmaximize', () => {
      this._mainWindow.webContents.send('app:maximized', false);
    });

    if (windowConfig.maximized) {
      log.info('Main window is maximized');
      this._mainWindow.maximize();
    }

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this._mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      this._mainWindow.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
      );
    }

    if (process.env.NODE_ENV === 'development') {
      this._mainWindow.webContents.openDevTools();
      installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
        .then(([redux, react]) => console.log(`Added Extensions:  ${redux.name}, ${react.name}`))
        .catch(err => console.log('An error occurred: ', err));
    } else {
      this._mainWindow.setMenu(null);
    }
  }

  startListening() {
    electron.nativeTheme.on('updated', () => {
      log.info('windowManager: nativeTheme updated');
      const theme = electron.nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
      this._mainWindow.webContents.send('app:nativeThemeChanged', theme);
    });
  }

  public closeMainWindow() {
    log.info('Closing main window');
    StorageManager.instance.saveMainWindowConfig();
    this._mainWindow.close();
  }

  public getMainWindowConfig(): UserConfig['windowConfig'] {
    const { x, y, width, height } = this._mainWindow.getBounds();
    const maximized = this._mainWindow.isMaximized();
    return {
      x,
      y,
      width,
      height,
      maximized
    };
  }

  get mainWindow() {
    return this._mainWindow;
  }
}
