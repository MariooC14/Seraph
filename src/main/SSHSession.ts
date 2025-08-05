import { Config, NodeSSH } from 'node-ssh';
import { TerminalsService } from './service/terminals-service';
import log from 'electron-log/main';
import { ClientChannel, PseudoTtyOptions } from 'ssh2';
import { TerminalSession } from './TerminalSession';
import { SSHSessionController } from './controllers/ssh-session-controller';
import { IPCError } from './helpers';

const DEFAULT_TTY_OPTS: PseudoTtyOptions = {
  cols: 80,
  rows: 24,
  term: 'xterm-color'
};
const DEFAULT_SSH_PORT = 22;

export class SSHSession extends TerminalSession {
  private ssh?: NodeSSH;
  private clientSSHChannel?: ClientChannel;
  private controller: SSHSessionController;

  constructor(
    terminalManager: TerminalsService,
    sessionId: string,
    private hostConfig: Config
  ) {
    super(terminalManager, sessionId);
    this.ssh = new NodeSSH();
    if (!this.hostConfig.port) {
      this.hostConfig.port = DEFAULT_SSH_PORT;
    }
  }

  init() {}

  public async attemptConnection() {
    try {
      await this.ssh.connect(this.hostConfig);
      return true;
    } catch (error) {
      if (error instanceof AggregateError) {
        log.error(`[SSHSession] - Failed to connect to SSH server: ${error.errors}`);
        throw new IPCError(
          'SSHConnectionError',
          'Multiple errors occurred while connecting to SSH server',
          { messages: error.errors.map(e => e.message) }
        );
      }
      throw new IPCError(
        'SSHConnectionError',
        `Failed to connect to SSH server: ${error.message}`,
        { messages: [error.message] }
      );
    }
  }

  async getPty() {
    if (this.clientSSHChannel && !this.clientSSHChannel?.closed) {
      return; // PTY already set up
    }

    this.clientSSHChannel = await this.ssh.requestShell(DEFAULT_TTY_OPTS);
    this.clientSSHChannel.on('data', (data: Buffer) => {
      this.controller.sendInputToClient(data.toString('utf8'));
    });
    this.clientSSHChannel.on('exit', code => {
      this.controller.sendExitSignal(code);
    });
  }

  public writeToPty(input: string) {
    this.clientSSHChannel?.write(input);
  }

  public terminate() {
    this.clientSSHChannel?.close();
  }

  // todo: Check if this is needed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public resize(_cols: number, _rows: number): void {
    log.warn('[SSHSession] - Resize not implemented for SSH sessions');
  }

  setController(controller: SSHSessionController) {
    this.controller = controller;
    return this;
  }
}
