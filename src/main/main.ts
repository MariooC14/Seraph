import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { TerminalsService } from './TerminalManager';
import { StorageManager } from './StorageManager';
import { WindowManager } from './windowManager';
import log from 'electron-log/main';
import { HostConfigManager } from './HostConfigManager';
import { WindowController } from './controllers/window-controller';
import { TerminalsController } from './controllers/terminals-controller';

let terminalsService: TerminalsService;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  WindowManager.init();
  HostConfigManager.init();
  StorageManager.init();
  WindowManager.instance.createMainWindow();
  terminalsService = new TerminalsService();

  new TerminalsController(terminalsService).startListening();
  new WindowController().startListening();
});

app.on('before-quit', () => {
  log.info('[Main] - App is about to quit');
  terminalsService.terminateAllSessions();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  terminalsService.terminateAllSessions();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    WindowManager.instance.createMainWindow();
    terminalsService.window = WindowManager.instance.mainWindow;
  }
});
