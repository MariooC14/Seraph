import { BrowserWindow } from 'electron';
import { IpcController } from './ipc-controller';
import { SSHSession } from '../SSHSession';

export class SSHSessionController extends IpcController {
  constructor(
    private readonly window: BrowserWindow,
    private sshSession: SSHSession
  ) {
    super(`terminalSession-${sshSession.sessionId}`);
    this.addHandler('clientInput', (input: string) => this.handleClientInput(input));
    this.addHandler('resize', (cols: number, rows: number) => this.handleResize(cols, rows));
    this.addHandler('kill', () => this.handleKill());
  }

  handleClientInput(input: string) {
    this.sshSession.writeToPty(input);
  }

  handleResize(cols: number, rows: number) {
    this.sshSession.resize(cols, rows);
  }

  handleKill() {
    this.sshSession.terminate();
  }

  sendInputToClient(input: string) {
    this.window.webContents.send(`${this.baseChannel}:updateData`, input);
  }

  sendExitSignal(exitCode: number) {
    this.window.webContents.send(`${this.baseChannel}:exit`, exitCode);
  }
}
