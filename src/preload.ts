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

contextBridge.exposeInMainWorld("app", {
  exit: () => ipcRenderer.invoke("app:exit"),
  maximize: () => ipcRenderer.invoke("app:maximize"),
  unmaximize: () => ipcRenderer.invoke("app:unmaximize"),
  minimize: () => ipcRenderer.invoke("app:minimize"),
  onMaximized: (callback: (maximized: boolean) => void) =>
    ipcRenderer.on("app:maximized", (_event, maximized) => callback(maximized)),
  onNativeThemeChanged: (callback: (theme: Theme) => void) =>
    ipcRenderer.on("app:nativeThemeChanged", (_event, value) =>
      callback(value)
    ),
});
