import * as pty from 'node-pty';
import { v4 as uuidv4 } from 'uuid';
import log from 'electron-log/main';
import { BrowserWindow, ipcMain } from 'electron';
import { TerminalSessionError } from './TerminalSessionException';
import { TerminalManager } from './TerminalManager';

const isWindows = process.platform === 'win32';

/**
 * TerminalSession class is responsible for managing a terminal session.
 * It handles spawning a terminal, sending input to it, resizing it, and listening for data from the terminal.
 */
export class TerminalSession {
  private manager: TerminalManager;
  /* The window the session is attached to - may be destroyed without us knowing */
  private window?: BrowserWindow;
  private terminal: pty.IPty;
  private _sessionId: string;
  private channel: string;

  public constructor(manager: TerminalManager, shellPath: string) {
    this.manager = manager;
    this.window = manager.window;
    this.spawnTerminal(shellPath);
    this.channel = `terminalSession-${this._sessionId}`;
  }

  public startListening() {
    log.info(`[TerminalSession] - Starting to listen for events on channel: ${this.channel}`);
    ipcMain.handle(
      `${this.channel}:clientInput`,
      (_event: Electron.IpcMainInvokeEvent, input: string) => {
        this.terminal.write(input);
      }
    );
    ipcMain.handle(
      `${this.channel}:resize`,
      (_event: Electron.IpcMainInvokeEvent, cols: number, rows: number) => {
        log.info('[TerminalSession] - Resizing terminal:', cols, rows);
        this.resizeTerminal(cols, rows);
      }
    );
    ipcMain.handle(`${this.channel}:kill`, () => {
      log.info('[TerminalSession] - Received terminal session termination');
      this.terminate();
      this.manager.removeSession(this._sessionId);
    });
    this.terminal.onData(data => {
      this.window?.webContents.send(`${this.channel}:updateData`, data);
    });
    this.terminal.onExit(code => {
      log.info('[TerminalSession] - Terminal exited with code:', code);
      this.manager.removeSession(this._sessionId);
      this.window?.webContents.send(`${this.channel}:exit`, code.exitCode);
    });
  }

  private stopListening() {
    log.info(`[TerminalSession] - Stopping channel listeners for ${this.channel}`);
    ipcMain.removeHandler(`${this.channel}:clientInput`);
    ipcMain.removeHandler(`${this.channel}:resize`);
    ipcMain.removeHandler(`${this.channel}:kill`);
  }

  private spawnTerminal(shellPath: string) {
    this._sessionId = uuidv4();

    try {
      this.terminal = pty.spawn(shellPath, [], {
        name: `seraph-session-${this._sessionId}`,
        cols: 80,
        rows: 30,
        cwd: isWindows ? process.env.USERPROFILE : process.env.HOME,
        env: process.env,
        useConpty: false // Do not remove or set to true - conpty is unstable on windows
      });
      log.info(`[TerminalSession] - Spawned new terminal with sessionId: ${this._sessionId}`);
      log.info(`[TerminalSession] - Terminal process id: ${this.terminal.pid}`);
    } catch (error) {
      log.error(`[TerminalSession] - Failed to spawn terminal: ${error}`);
      throw new TerminalSessionError(`Failed to spawn terminal: ${error}`);
    }
  }

  resizeTerminal(cols: number, rows: number) {
    this.terminal.resize(cols, rows);
  }

  public terminate() {
    log.info(`[TerminalSession] - Terminating terminal session: ${this._sessionId}`);
    this.window = null;
    this.stopListening();
    this.terminal.kill();
  }

  get sessionId() {
    return this._sessionId;
  }
}
