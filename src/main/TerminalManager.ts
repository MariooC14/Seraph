/**
 * Handles user input from the browser's xterm instance.
 * Only handles one terminal instance
 */

import os from 'node:os';
import { app, BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log/main';
import fs from 'node:fs';
import { join } from 'node:path';
import { getAvailableShells } from './helpers';
import { TerminalSession } from './TerminalSession';
import { HostConfig } from '@/dts/host-config';

export class TerminalManager {
  shell: string;
  _window: BrowserWindow;
  sessions: Map<string, TerminalSession> = new Map();

  public constructor(window: BrowserWindow) {
    this._window = window;
    this.shell = this.getShell();
  }

  public startListening() {
    ipcMain.handle('terminal:createSession', (_event, shellPath: string) => {
      log.info(`Creating new session with shell: ${shellPath}`);
      const newSessionId = this.createSession(shellPath);
      return newSessionId;
    });
    ipcMain.handle('terminal:getUserPreferredShell', () => this.getUserPreferredShell());
    ipcMain.handle('terminal:getAvailableShells', () => this.getAvailableShells());
    ipcMain.handle('terminal:saveDefaultShell', (_, newShellPath: string) =>
      this.saveDefaultShell(newShellPath)
    );
  }

  getShell() {
    return process.env.SHELL || this.getDefaultShell();
  }

  getDefaultShell(): string {
    if (os.platform() === 'win32') {
      return 'powershell.exe';
    }
    return 'bash';
  }

  public getUserPreferredShell() {
    const configPath = join(app.getPath('userData'), 'config.json');
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify({ shell: this.shell }));
      return this.shell;
    } else {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      log.info('[TerminalManager] - user-preferred shell:', config);
      return (config.shell as string) || this.shell;
    }
  }

  public saveDefaultShell(newShellPath: string) {
    const configPath = join(app.getPath('userData'), 'config.json');

    try {
      if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ shell: newShellPath }));
      } else {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        config.shell = newShellPath;
        fs.writeFileSync(configPath, JSON.stringify(config));
      }
      return true;
    } catch (error) {
      log.error('[TerminalManager] - Failed to save default shell:', error);
      return false;
    }
  }

  public async getAvailableShells() {
    return await getAvailableShells(os.platform());
  }

  createSession(shellPath: string) {
    const newTerminalSession = new TerminalSession(this, shellPath);
    newTerminalSession.startListening();
    this.sessions.set(newTerminalSession.sessionId, newTerminalSession);
    return newTerminalSession.sessionId;
  }

  createSSHSession(hostConfig: HostConfig) {
    const sessionId = this.createSession(this.getUserPreferredShell());
    const session = this.sessions.get(sessionId);

    if (session) {
      // Connect to the SSH host after a brief delay to ensure terminal is ready
      setTimeout(() => {
        session.connectToHost(hostConfig);
      }, 500);
    }

    return sessionId;
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
