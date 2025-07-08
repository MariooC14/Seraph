import { BrowserWindow } from 'electron';
import { LocalTerminalSession } from '../LocalTerminalSession';
import { IpcController } from './ipc-controller';

export class LocalSessionController extends IpcController {
  constructor(
    private readonly window: BrowserWindow,
    private localTerminalSession?: LocalTerminalSession
  ) {
    super(`terminalSession-${localTerminalSession?.sessionId}`);
    this.addHandler('clientInput', (input: string) => this.handleClientInput(input));
    this.addHandler('resize', (cols: number, rows: number) => this.handleResize(cols, rows));
    this.addHandler('kill', () => this.localTerminalSession.terminate());
  }

  handleClientInput(input: string) {
    this.localTerminalSession.writeToPty(input);
  }

  handleResize(cols: number, rows: number) {
    this.localTerminalSession.resize(cols, rows);
  }

  handleKill() {
    this.localTerminalSession.terminate();
  }

  sendInputToClient(input: string) {
    this.window.webContents.send(`${this.baseChannel}:updateData`, input);
  }

  sendExitSignal(exitCode: number) {
    this.window.webContents.send(`${this.baseChannel}:exit`, exitCode);
  }
}
