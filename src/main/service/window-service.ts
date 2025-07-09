import electron, { BrowserWindow } from 'electron';
import {
  installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import path from 'node:path';
import { StorageManager } from '../StorageManager';
import { WindowController } from '../controllers/window-controller';

export class WindowService {
  private static _instance?: WindowService;
  private _mainWindow: BrowserWindow;
  private controller: WindowController;

  constructor(controller: WindowController) {
    this.controller = controller;
  }

  static init(controller: WindowController) {
    this._instance = new WindowService(controller);
    this._instance.startListening();
  }

  public static get instance(): WindowService {
    if (!this._instance) {
      throw new Error('[window-service] - WindowService has not been init');
    }
    return this._instance;
  }

  public createMainWindow() {
    const { windowConfig } = StorageManager.instance.getUserConfig();
    this._mainWindow = new BrowserWindow({
      ...windowConfig,
      minWidth: 500,
      minHeight: 500,
      titleBarStyle: 'hidden',
      vibrancy: 'hud',
      trafficLightPosition: { x: 10, y: 12 },
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    });
    this.controller.setWindow(this._mainWindow);

    this._mainWindow.on('maximize', () => {
      this.controller.sendMaximizedSignal(true);
    });
    this._mainWindow.on('unmaximize', () => {
      this.controller.sendMaximizedSignal(false);
    });
    this._mainWindow.on('close', () => {
      this.controller.setWindow(undefined);
      StorageManager.instance.saveMainWindowConfig();
    });

    if (windowConfig.maximized) {
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
      const theme = electron.nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
      this.controller.sendThemeChangedSignal(theme);
    });
  }

  public closeMainWindow() {
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
