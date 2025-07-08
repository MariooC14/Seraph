/**
 * Base class for TTY sessions.
 * This class is responsible for managing the TTY session lifecycle, including
 * connecting, disconnecting, and handling data transfer between the client and the server, be it local or remote.
 */

import { TerminalsService } from './terminals-service';

export abstract class TerminalSession {
  public constructor(
    protected terminalsService: TerminalsService,
    public readonly sessionId: string
  ) {}

  public abstract init(...args: unknown[]): Promise<void> | void;
  public abstract terminate(): void;
  public abstract resize(cols: number, rows: number): void;
}
