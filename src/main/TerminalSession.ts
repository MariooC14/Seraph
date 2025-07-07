/**
 * Base class for TTY sessions.
 * This class is responsible for managing the TTY session lifecycle, including
 * connecting, disconnecting, and handling data transfer between the client and the server, be it local or remote.
 */

import { BrowserWindow } from 'electron';
import { TerminalsService } from './terminals-service';

export abstract class TerminalSession {
  public readonly sessionId: string;
  /**
   * The window the session is attached to - may be destroyed without us knowing
   */
  protected window?: BrowserWindow;

  /**
   * The electron channel to send data to the renderer process.
   */
  protected channel: string;
  // Could use singleton pattern here
  protected terminalManager: TerminalsService;

  public constructor(terminalManager: TerminalsService, sessionId: string, window?: BrowserWindow) {
    this.terminalManager = terminalManager;
    this.sessionId = sessionId;
    this.window = window;
    this.channel = `terminalSession-${this.sessionId}`;
  }

  public abstract init(...args: unknown[]): Promise<void> | void;
  public abstract terminate(): void;
  public abstract sendData(data: string): void;
  public abstract resize(cols: number, rows: number): void;
}
