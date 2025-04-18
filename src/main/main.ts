import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { TerminalManager } from "./TerminalManager";
import { WindowManager } from "./windowManager";

let terminalManager: TerminalManager;
let windowManager: WindowManager;
let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // if (process.env.NODE_ENV === "development")
  // mainWindow.webContents.openDevTools();
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

  ipcMain.handle("app:exit", () => {
    terminalManager.killAllTerminals();
    if (process.platform !== "darwin") {
      app.quit();
    } else {
      mainWindow.close();
    }
  });
  ipcMain.handle("app:minimize", () => mainWindow.minimize());
  ipcMain.handle("app:maximize", () => mainWindow.maximize());
  ipcMain.handle("app:unmaximize", () => mainWindow.unmaximize());

  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("app:maximized", true);
  });
  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("app:maximized", false);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
