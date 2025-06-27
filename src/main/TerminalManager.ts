/**
 * Handles user input from the browser's xterm instance.
 * Only handles one terminal instance
 */

import { BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log/main';
import { v4 as uuidv4 } from 'uuid';
import { getAvailableShells, isWindows } from './helpers';
import { LocalTerminalSession } from './LocalTerminalSession';
import { TerminalSession } from './TerminalSession';
import { SSHSession } from './SSHSession';
import { HostConfigManager } from './HostConfigManager';
import { StorageManager } from './StorageManager';
import { WindowManager } from './windowManager';

export class TerminalManager {
  shell: string;
  _window: BrowserWindow;
  sessions: Map<string, TerminalSession> = new Map();

  public constructor() {
    this.shell = this.getShell();
  }

  public init() {
    this._window = WindowManager.instance.mainWindow;
    ipcMain.handle('terminal:createLocalSession', (_event, shellPath: string) => {
      log.info(`Creating new session with shell: ${shellPath}`);
      const newSessionId = this.createLocalSession(shellPath);
      return newSessionId;
    });
    ipcMain.handle('terminal:createSSHSession', async (_event, hostId): IPCPromise<string> => {
      try {
        const newSessionId = await this.createSSHSession(hostId);
        return {
          success: true,
          data: newSessionId
        };
      } catch (error) {
        log.error(`[TerminalManager] - Failed to create SSH session: ${error.message}`);
        return {
          success: false,
          error: error.message
        };
      }
    });
    ipcMain.handle('terminal:getUserPreferredShell', () => this.getUserPreferredShell());
    ipcMain.handle('terminal:getAvailableShells', () => getAvailableShells());
    ipcMain.handle('terminal:saveDefaultShell', (_, newShellPath: string) =>
      this.saveDefaultShell(newShellPath)
    );
  }

  /** Gets the shell from the env vars or the default shell for the OS. */
  getShell() {
    return process.env.SHELL || this.getDefaultShell();
  }

  getDefaultShell() {
    if (isWindows()) {
      return 'powershell.exe';
    }
    return 'bash';
  }

  public getUserPreferredShell() {
    return StorageManager.instance.getUserConfig().preferredShell;
  }

  public saveDefaultShell(newShellPath: string) {
    return StorageManager.instance.saveUserConfig({
      ...StorageManager.instance.getUserConfig(),
      preferredShell: newShellPath
    });
  }

  createLocalSession(shellPath: string) {
    const newSessionId = uuidv4();
    const newLocalTerminalSession = new LocalTerminalSession(
      this,
      newSessionId,
      this._window,
      shellPath
    );
    newLocalTerminalSession.init();
    this.sessions.set(newLocalTerminalSession.sessionId, newLocalTerminalSession);
    return newSessionId;
  }

  /** Creates an ssh session with given host config
   * @returns the session id of the new session
   */
  async createSSHSession(hostId: string) {
    const hostConfig = HostConfigManager.instance.getHostConfig(hostId);
    if (!hostConfig) {
      log.error(`[TerminalManager] - No host config found for id: ${hostId}`);
      throw new Error(`No host config found for id: ${hostId}`);
    }
    const newSessionId = uuidv4();
    const newSSHSession = new SSHSession(this, newSessionId, this._window, hostConfig);
    await newSSHSession.init();
    this.sessions.set(newSSHSession.sessionId, newSSHSession);
    return newSessionId;
  }

  public terminateAllSessions() {
    log.info('[TerminalManager] - Terminating all terminal sessions');
    for (const session of this.sessions.values()) {
      session.terminate();
    }
    this.sessions.clear();
  }

  // Remove a session without terminating it - this can happen when a session is already closed
  public removeSession(sessionId: string) {
    log.info(`[TerminalManager] - Removing session ${sessionId} from manager`);
    this.sessions.delete(sessionId);
  }

  public get window() {
    return this._window;
  }

  public set window(newWindow: BrowserWindow) {
    this._window = newWindow;
  }
}
