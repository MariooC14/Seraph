import { defaultTerminalOptions } from '@/features/terminalTabs/terminalConfig';
import { ITerminalOptions, Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { isNewTabKey } from '@/lib/utils';
import { isCloseTabKey, isNextTabKey, isPreviousTabKey } from '@/lib/utils';

const shortcutIgnoreKeys = [isNewTabKey, isCloseTabKey, isPreviousTabKey, isNextTabKey];

export class ClientTerminalSession {
  private readonly _sessionId: string;
  private terminal: Terminal;
  private fitAddon: FitAddon;
  private webLinksAddon: WebLinksAddon;
  public isVisible: boolean = false;

  /** Creates a terminal session given an existing pty's session id */
  constructor(sessionId: string) {
    this._sessionId = sessionId;
    this.terminal = new Terminal(defaultTerminalOptions);
  }

  public attachTo(parent: HTMLElement) {
    this.terminal.open(parent);

    this.fitAddon = new FitAddon();
    this.webLinksAddon = new WebLinksAddon();

    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(this.webLinksAddon);

    // Handle user input
    this.terminal.onData(data => {
      window.terminal.sendData(this._sessionId, data);
    });

    // Handle input from PTY
    window.terminal.onData(this._sessionId, newData => {
      this.terminal.write(newData);
    });

    this.terminal.attachCustomKeyEventHandler(event => {
      for (const isIgnoreKey of shortcutIgnoreKeys) {
        if (isIgnoreKey(event)) {
          return false;
        }
      }
      return true;
    });
  }

  public focus() {
    this.terminal.focus();
  }

  public get sessionId() {
    return this._sessionId;
  }

  public resize() {
    if (!this.isVisible) {
      return;
    }
    const { rows, cols } = this.fitAddon.proposeDimensions();
    if (rows !== this.terminal.rows || cols !== this.terminal.cols) {
      this.fitAddon.fit();
      window.terminal.resizeTerminal(this._sessionId, cols, rows);
    }
  }

  public terminate() {
    window.terminal.terminateSession(this._sessionId);
    this.terminal.dispose();
  }

  public get terminalOptions() {
    return this.terminal.options;
  }

  public set terminalOptions(options: ITerminalOptions) {
    this.terminal.options = options;
  }
}
