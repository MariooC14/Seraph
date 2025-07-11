import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import { TerminalsService } from './service/terminals-service';
import { StorageManager } from './StorageManager';
import { WindowService } from './service/window-service';
import log from 'electron-log/main';
import { HostsService } from './service/hosts-service';
import { WindowController } from './controllers/window-controller';
import { TerminalsController } from './controllers/terminals-controller';
import { HostsController } from './controllers/hosts-controller';

let terminalsService: TerminalsService;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const windowController = new WindowController();
  WindowService.init(windowController);
  HostsService.init();
  StorageManager.init();
  WindowService.instance.createMainWindow();
  terminalsService = new TerminalsService();

  new HostsController(HostsService.instance).startListening();
  new TerminalsController(terminalsService).startListening();
  windowController.startListening();
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
    WindowService.instance.createMainWindow();
    terminalsService.window = WindowService.instance.mainWindow;
  }
});
