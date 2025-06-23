import * as pty from 'node-pty';
import log from 'electron-log/main';
import { BrowserWindow, ipcMain } from 'electron';
import { TerminalSessionError } from './TerminalSessionException';
import { TerminalManager } from './TerminalManager';
import { TerminalSession } from './TerminalSession';

const isWindows = process.platform === 'win32';

/**
 * TerminalSession class is responsible for managing a terminal session.
 * It handles spawning a terminal, sending input to it, resizing it, and listening for data from the terminal.
 */
export class LocalTerminalSession extends TerminalSession {
  private terminal: pty.IPty;
  private shellPath: string;

  public constructor(
    manager: TerminalManager,
    sessionId: string,
    window?: BrowserWindow,
    shellPath?: string
  ) {
    super(manager, sessionId, window);
    this.shellPath = shellPath || this.terminalManager.getShell();
  }

  /**
   * Initializes a session byt spawning a pty and setting up listeners for data and exit events.
   */
  init() {
    try {
      this.terminal = pty.spawn(this.shellPath, [], {
        name: `seraph-session-${this.sessionId}`,
        cols: 80,
        rows: 30,
        cwd: isWindows ? process.env.USERPROFILE : process.env.HOME,
        env: process.env,
        useConpty: false // Do not remove or set to true - conpty is unstable on windows
      });
      log.info(
        `[LocalSession] - Spawned new terminal with sessionId: ${this.sessionId}; pid: ${this.terminal.pid}`
      );
      this.setupListeners();
    } catch (error) {
      log.error(`[LocalSession] - Failed to spawn terminal: ${error}`);
      throw new TerminalSessionError(`Failed to spawn terminal: ${error}`);
    }
  }

  setupListeners() {
    log.info(`[LocalSession] - Starting to listen for events on channel: ${this.channel}`);
    ipcMain.handle(`${this.channel}:clientInput`, (_event, input: string) => {
      this.terminal.write(input);
    });
    ipcMain.handle(`${this.channel}:resize`, (_event, cols: number, rows: number) => {
      this.resize(cols, rows);
    });
    ipcMain.handle(`${this.channel}:kill`, () => {
      this.terminate();
    });
    this.terminal.onData(data => {
      this.sendData(data);
    });
    this.terminal.onExit(code => {
      log.info('[TerminalSession] - Terminal exited with code:', code);
      this.terminalManager.removeSession(this.sessionId);
      this.window?.webContents.send(`${this.channel}:exit`, code.exitCode);
    });
  }

  sendData(data: string) {
    this.window?.webContents.send(`${this.channel}:updateData`, data);
  }

  resize(cols: number, rows: number) {
    log.info('[LocalSession] - Resizing terminal:', cols, rows);
    this.terminal.resize(cols, rows);
  }

  public terminate() {
    log.info(`[LocalSession] - Terminating terminal session: ${this.sessionId}`);
    this.window = null;
    ipcMain.removeHandler(`${this.channel}:clientInput`);
    ipcMain.removeHandler(`${this.channel}:resize`);
    ipcMain.removeHandler(`${this.channel}:kill`);
    this.terminal.kill();
    this.terminalManager.removeSession(this.sessionId);
  }
}
