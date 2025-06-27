// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron/renderer';
import { HostConfig } from './dts/host-config';

contextBridge.exposeInMainWorld('terminal', {
  createLocalSession: (shellPath: string) =>
    ipcRenderer.invoke('terminal:createLocalSession', shellPath),
  createSSHSession: (hostId: string) => ipcRenderer.invoke('terminal:createSSHSession', hostId),
  resizeTerminal: (sessionId: string, cols: number, rows: number) =>
    ipcRenderer.invoke(`terminalSession-${sessionId}:resize`, cols, rows),
  terminateSession: (sessionId: string) =>
    ipcRenderer.invoke(`terminalSession-${sessionId}:kill`, sessionId),
  onSessionTerminated: (sessionId: string, callback: (code: string) => void) =>
    ipcRenderer.on(`terminalSession-${sessionId}:exit`, (_event, code) => callback(code)),
  killAllTerminals: () => ipcRenderer.invoke('terminal:killAll'),
  sendData: (sessionId: string, data: string) =>
    ipcRenderer.invoke(`terminalSession-${sessionId}:clientInput`, data),
  onData: (sessionId: string, callback: (newData: string) => void) =>
    ipcRenderer.on(`terminalSession-${sessionId}:updateData`, (_event, newData) =>
      callback(newData)
    ),
  getUserPreferredShell: () => ipcRenderer.invoke('terminal:getUserPreferredShell'),
  getAvailableShells: () => ipcRenderer.invoke('terminal:getAvailableShells'),
  saveDefaultShell: (newShellPath: string) =>
    ipcRenderer.invoke('terminal:saveDefaultShell', newShellPath)
});

contextBridge.exposeInMainWorld('app', {
  exit: () => ipcRenderer.invoke('app:exit'),
  maximize: () => ipcRenderer.invoke('app:maximize'),
  unmaximize: () => ipcRenderer.invoke('app:unmaximize'),
  minimize: () => ipcRenderer.invoke('app:minimize'),
  isMaximized: () => ipcRenderer.invoke('app:isMaximized'),
  onMaximized: (callback: (maximized: boolean) => void) =>
    ipcRenderer.on('app:maximized', (_event, maximized) => callback(maximized)),
  onNativeThemeChanged: (callback: (theme: Theme) => void) =>
    ipcRenderer.on('app:nativeThemeChanged', (_event, value) => callback(value)),
  isMacOS: () => process.platform === 'darwin'
});

contextBridge.exposeInMainWorld('hosts', {
  getAll: () => ipcRenderer.invoke('hosts:getAll'),
  get: (id: string) => ipcRenderer.invoke('hosts:getById', id),
  add: (host: HostConfig) => ipcRenderer.invoke('hosts:add', host),
  remove: (id: string) => ipcRenderer.invoke('hosts:remove', id)
});
