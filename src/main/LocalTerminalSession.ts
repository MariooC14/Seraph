import * as pty from 'node-pty';
import { TerminalSessionError } from './TerminalSessionException';
import { TerminalsService } from './terminals-service';
import { TerminalSession } from './TerminalSession';
import { isWindows } from './helpers';
import { LocalSessionController } from './controllers/local-session-controller';

/**
 * TerminalSession class is responsible for managing a terminal session.
 * It handles spawning a terminal, sending input to it, resizing it, and listening for data from the terminal.
 */
export class LocalTerminalSession extends TerminalSession {
  private terminal: pty.IPty;
  private shellPath: string;
  private controller?: LocalSessionController;

  public constructor(terminalsService: TerminalsService, sessionId: string, shellPath?: string) {
    super(terminalsService, sessionId);
    this.shellPath = shellPath || this.terminalsService.getShell();
  }

  init() {
    try {
      this.terminal = pty.spawn(this.shellPath, [], {
        name: `seraph-session-${this.sessionId}`,
        cols: 80,
        rows: 30,
        cwd: isWindows() ? process.env.USERPROFILE : process.env.HOME,
        env: process.env,
        useConpty: false // Do not remove or set to true - conpty is unstable on windows
      });
      this.setupPtyListeners();
    } catch (error) {
      throw new TerminalSessionError(`Failed to spawn terminal: ${error}`);
    }
  }

  setupPtyListeners() {
    this.terminal.onData(data => {
      this.controller?.sendInputToClient(data);
    });
    this.terminal.onExit(code => {
      this.terminalsService.removeSession(this.sessionId);
      this.controller?.sendExitSignal(code.exitCode);
    });
  }

  setController(controller: LocalSessionController) {
    this.controller = controller;
    return this;
  }

  writeToPty(input: string) {
    this.terminal.write(input);
  }

  resize(cols: number, rows: number) {
    this.terminal.resize(cols, rows);
  }

  public terminate() {
    this.controller.stopListening();
    this.controller = null;
    this.terminal.kill();
    this.terminalsService.removeSession(this.sessionId);
  }
}
