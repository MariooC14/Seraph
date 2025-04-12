// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("terminal", {
  spawnTerminal: () => ipcRenderer.invoke("terminal:spawn"),
  sendData: (data: string) => ipcRenderer.invoke("terminal:write", data),
  onData: (callback: (data: string) => void) =>
    ipcRenderer.on("terminal:updateData", (_event, value) => callback(value)),
});
