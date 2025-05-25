import { app, BrowserWindow, ipcMain } from 'electron';
import {
  installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { TerminalManager } from './TerminalManager';
import { WindowManager } from './windowManager';
import log from 'electron-log/main';
import { exec } from 'node:child_process';

let terminalManager: TerminalManager;
let windowManager: WindowManager;
let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  log.info('Creating main window');
  mainWindow = new BrowserWindow({
    minWidth: 1500,
    minHeight: 600,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 10, y: 12 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

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
  createWindow();
  terminalManager = new TerminalManager(mainWindow);
  windowManager = new WindowManager(mainWindow);

  terminalManager.startListening();
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
  ipcMain.handle('docker:listContainers', async () => {
    return new Promise((resolve, reject) => {
      exec('docker ps --format "{{json .}}"', (error, stdout) => {
        if (error) return reject(error);
        // Each line is a JSON object
        const containers = stdout
          .split('\n')
          .filter(Boolean)
          .map(line => JSON.parse(line));
        resolve(containers);
      });
    });
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('app:maximized', true);
  });
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('app:maximized', false);
  });
});

app.on('before-quit', () => {
  log.info('[Main] - App is about to quit');
  terminalManager.terminateAllSessions();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  terminalManager.terminateAllSessions();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    terminalManager.window = mainWindow;
    windowManager.mainWindow = mainWindow;
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
