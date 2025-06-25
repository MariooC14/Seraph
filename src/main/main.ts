import { app, BrowserWindow, ipcMain } from 'electron';
import {
  installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { TerminalManager } from './TerminalManager';
import { StorageManager } from './StorageManager';
import { WindowManager } from './windowManager';
import log from 'electron-log/main';
import { HostConfigManager } from './HostConfigManager';

let terminalManager: TerminalManager;
let windowManager: WindowManager;
let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = (windowConfig: UserConfig['windowConfig']) => {
  log.info('Creating main window');
  mainWindow = new BrowserWindow({
    ...windowConfig,
    minWidth: 500,
    minHeight: 500,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 10, y: 12 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('app:maximized', true);
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('app:maximized', false);
  });

  if (windowConfig.maximized) {
    log.info('Main window is maximized');
    mainWindow.maximize();
  }

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then(([redux, react]) => console.log(`Added Extensions:  ${redux.name}, ${react.name}`))
      .catch(err => console.log('An error occurred: ', err));
  } else {
    mainWindow.setMenu(null);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  terminalManager = new TerminalManager(mainWindow);
  windowManager = new WindowManager(mainWindow);

  HostConfigManager.init();
  StorageManager.init();
  terminalManager.init();
  const userConfig = StorageManager.instance.getUserConfig();
  createWindow(userConfig.windowConfig);
  windowManager.startListening();

  ipcMain.handle('app:exit', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      mainWindow.close();
    }
  });
  ipcMain.handle('app:minimize', () => mainWindow.minimize());
  ipcMain.handle('app:maximize', () => mainWindow.maximize());
  ipcMain.handle('app:unmaximize', () => mainWindow.unmaximize());
  ipcMain.handle('app:isMaximized', () => mainWindow.isMaximized());
});

app.on('before-quit', () => {
  StorageManager.instance.saveMainWindowConfig(mainWindow);
  log.info('[Main] - App is about to quit');
  terminalManager.terminateAllSessions();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  StorageManager.instance.saveMainWindowConfig(mainWindow);
  terminalManager.terminateAllSessions();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    const userConfig = StorageManager.instance.getUserConfig();
    createWindow(userConfig.windowConfig);
    terminalManager.window = mainWindow;
    windowManager.mainWindow = mainWindow;
  }
});
