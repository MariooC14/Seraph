import { ipcMain } from "electron";
import electron from "electron";

const titleBarThemes = {
  dark: {
    color: "#0a0a0a",
    symbolColor: "#636363",
  },
  light: {
    color: "#ffffff",
    symbolColor: "#000000",
  },
};

export class WindowManager {
  constructor(public mainWindow: Electron.BrowserWindow) {}

  startListening() {
    ipcMain.handle("windows:applyTheme", (_, theme: Theme) => {
      this.applyTheme(theme);
    });
    electron.nativeTheme.on("updated", () => {
      console.log("windowManager: nativeTheme updated");
      const theme = electron.nativeTheme.shouldUseDarkColors ? "dark" : "light";
      this.applyTheme(theme);
      this.mainWindow.webContents.send("windows:nativeThemeChanged", theme);
    });
  }

  applyTheme(theme: Theme) {
    console.log("windowManager: applying theme", theme);
    if (theme === "system") {
      const nativeTheme = electron.nativeTheme.shouldUseDarkColors
        ? "dark"
        : "light";
      this.mainWindow.setTitleBarOverlay(titleBarThemes[nativeTheme]);
    } else {
      this.mainWindow.setTitleBarOverlay(titleBarThemes[theme]);
    }
  }
}
