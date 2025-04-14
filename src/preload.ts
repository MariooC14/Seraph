// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("terminal", {
  spawnTerminal: (shellPath: string) =>
    ipcRenderer.invoke("terminal:spawn", shellPath),
  killTerminal: () => ipcRenderer.invoke("terminal:kill"),
  sendData: (data: string) => ipcRenderer.invoke("terminal:write", data),
  onData: (callback: (data: string) => void) =>
    ipcRenderer.on("terminal:updateData", (_event, value) => callback(value)),
  getUserPreferredShell: () =>
    ipcRenderer.invoke("terminal:getUserPreferredShell"),
  getAvailableShells: () => ipcRenderer.invoke("terminal:getAvailableShells"),
  saveDefaultShell: (newShellPath: string) =>
    ipcRenderer.invoke("terminal:saveDefaultShell", newShellPath),
});

contextBridge.exposeInMainWorld("windows", {
  applyTheme: (theme: Theme) => ipcRenderer.invoke("windows:applyTheme", theme),
  onNativeThemeChanged: (callback: (theme: Theme) => void) =>
    ipcRenderer.on("windows:nativeThemeChanged", (_event, value) =>
      callback(value)
    ),
});
