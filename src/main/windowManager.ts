import electron from "electron";
import log from "electron-log/main";

export class WindowManager {
  platform: NodeJS.Platform = process.platform;

  constructor(private mainWindow: Electron.BrowserWindow) {}

  startListening() {
    electron.nativeTheme.on("updated", () => {
      log.info("windowManager: nativeTheme updated");
      const theme = electron.nativeTheme.shouldUseDarkColors ? "dark" : "light";
      this.mainWindow.webContents.send("app:nativeThemeChanged", theme);
    });
  }
}
