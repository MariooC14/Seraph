import { BrowserWindow, ipcMain } from 'electron';
import { Config, NodeSSH } from 'node-ssh';
import { TerminalManager } from './TerminalManager';
import log from 'electron-log/main';
import { ClientChannel, PseudoTtyOptions } from 'ssh2';
import { TerminalSession } from './TerminalSession';

const DEFAULT_TTY_OPTS: PseudoTtyOptions = {
  cols: 80,
  rows: 24,
  term: 'xterm-color'
};

export class SSHSession extends TerminalSession {
  private ssh?: NodeSSH;
  private clientSSHChannel?: ClientChannel;

  constructor(
    terminalManager: TerminalManager,
    sessionId: string,
    window: BrowserWindow,
    private hostConfig: Config
  ) {
    super(terminalManager, sessionId, window);
  }

  // Once the connection has been established, we can start listening for events
  // and sending data to the SSH server.
  // THIS IS FRAGILE - I don't know if this is the right way to do this
  public async init() {
    log.info('[SSHSession] - Connecting with config:', this.hostConfig);
    this.addIpcListeners();

    try {
      this.ssh = await new NodeSSH().connect(this.hostConfig);
      this.clientSSHChannel = await this.ssh.requestShell(DEFAULT_TTY_OPTS);

      this.clientSSHChannel.on('data', (data: Buffer) => {
        this.sendData(data.toString('utf8'));
      });

      this.clientSSHChannel.on('exit', code => {
        log.info('[SSHSession] - SSH session closed');
        this.window.webContents.send(`${this.channel}:exit`, code);
      });

      log.info(`[SSHSession] - SSH session initialized with sessionId: ${this.sessionId};`);
    } catch (error) {
      // We'll need to improve error handling here
      if (error instanceof AggregateError) {
        log.error(`[SSHSession] - Failed to connect to SSH server: ${error.errors}`);
      }
      throw new Error(error.errors[0]);
    }
  }

  private addIpcListeners() {
    ipcMain.handle(`${this.channel}:clientInput`, (_event, input: string) => {
      this.clientSSHChannel?.write(input);
    });
    ipcMain.handle(`${this.channel}:resize`, (_event, cols: number, rows: number) => {
      this.resize(cols, rows);
    });
    ipcMain.handle(`${this.channel}:kill`, () => {
      log.info('[SSHSession] - Killing SSH session');
      this.terminate();
    });
  }

  public terminate() {
    this.clientSSHChannel?.close();
  }

  public sendData(data: string): void {
    this.window.webContents.send(`${this.channel}:updateData`, data);
  }

  // todo: Check if this is needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public resize(_cols: number, _rows: number): void {
    log.warn('[SSHSession] - Resize not implemented for SSH sessions');
  }
}
