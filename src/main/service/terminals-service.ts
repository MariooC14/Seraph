import { BrowserWindow } from 'electron';
import log from 'electron-log/main';
import { v4 as uuidv4 } from 'uuid';
import { getAvailableShells, isWindows } from '../helpers';
import { LocalTerminalSession } from '../LocalTerminalSession';
import { TerminalSession } from '../TerminalSession';
import { SSHSession } from '../SSHSession';
import { HostsService } from './hosts-service';
import { StorageManager } from '../StorageManager';
import { WindowService } from './window-service';
import { LocalSessionController } from '../controllers/local-session-controller';
import { SSHSessionController } from '../controllers/ssh-session-controller';

export class TerminalsService {
  shell: string = this.getShell();
  _window: BrowserWindow;
  sessions: Map<string, TerminalSession> = new Map();

  public constructor() {
    this._window = WindowService.instance.mainWindow;
  }

  public getAvailableShells() {
    return getAvailableShells();
  }

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
    const newSesh = new LocalTerminalSession(this, newSessionId, shellPath);
    const controller = new LocalSessionController(this.window, newSesh).startListening();
    newSesh.setController(controller).init();
    this.sessions.set(newSesh.sessionId, newSesh);
    return newSessionId;
  }

  async createSSHSession(hostId: string) {
    const hostConfig = HostsService.instance.getHostById(hostId);
    if (!hostConfig) {
      throw new Error(`No host config found for id: ${hostId}`);
    }
    const newSessionId = uuidv4();
    const newSSHSession = new SSHSession(this, newSessionId, hostConfig);
    const controller = new SSHSessionController(this._window, newSSHSession).startListening();
    newSSHSession.setController(controller);
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
