import { IPCResponse } from '../helpers';
import { TerminalsService } from '../terminals-service';
import { IpcController } from './ipc-controller';

export class TerminalsController extends IpcController {
  constructor(private readonly terminalService: TerminalsService) {
    super('terminal');
    this.addHandler('getAvailableShells', () => this.getAvailableShells());
    this.addHandler('getUserPreferredShell', () => this.getUserPreferredShell());
    this.addHandler('saveDefaultShell', (newShellPath: string) =>
      this.saveDefaultShell(newShellPath)
    );
    this.addHandler('createLocalSession', (shellPath: string) =>
      this.createLocalSession(shellPath)
    );
  }

  createLocalSession(shellPath: string): string {
    const newSessionId = this.terminalService.createLocalSession(shellPath);
    return newSessionId;
  }

  @IPCResponse<string>()
  async createSSHSession(hostId: string) {
    return this.terminalService.createSSHSession(hostId);
  }

  getUserPreferredShell(): string {
    return this.terminalService.getUserPreferredShell();
  }

  async getAvailableShells() {
    return this.terminalService.getAvailableShells();
  }

  saveDefaultShell(newShellPath: string) {
    return this.terminalService.saveDefaultShell(newShellPath);
  }
}
