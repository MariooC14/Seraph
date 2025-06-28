import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import { TerminalManager } from './TerminalManager';
import { StorageManager } from './StorageManager';
import { WindowManager } from './windowManager';
import log from 'electron-log/main';
import { HostConfigManager } from './HostConfigManager';

let terminalManager: TerminalManager;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  terminalManager = new TerminalManager();
  WindowManager.init();
  HostConfigManager.init();
  StorageManager.init();
  WindowManager.instance.createMainWindow();
  terminalManager.init();

  ipcMain.handle('app:exit', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      WindowManager.instance.closeMainWindow();
    }
  });
  ipcMain.handle('app:minimize', () => WindowManager.instance.mainWindow.minimize());
  ipcMain.handle('app:maximize', () => WindowManager.instance.mainWindow.maximize());
  ipcMain.handle('app:unmaximize', () => WindowManager.instance.mainWindow.unmaximize());
  ipcMain.handle('app:isMaximized', () => WindowManager.instance.mainWindow.isMaximized());
});

app.on('before-quit', () => {
  StorageManager.instance.saveMainWindowConfig();
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
    WindowManager.instance.createMainWindow();
    terminalManager.window = WindowManager.instance.mainWindow;
  }
});
