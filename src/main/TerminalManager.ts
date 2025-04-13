/**
 * Handles user input from the browser's xterm instance.
 * Only handles one terminal instance
 */

import os from "node:os";
import * as pty from "node-pty";
import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";

export class TerminalManager {
  shell: string;
  terminal?: pty.IPty;
  window: BrowserWindow;

  public constructor(window: BrowserWindow) {
    this.window = window;
    this.shell = this.getShell();
  }

  public startListening() {
    ipcMain.handle("terminal:spawn", () => this.spawnTerminal());
    ipcMain.handle("terminal:write", (_, data: string) =>
      this.sendData(_, data)
    );
  }

  getShell() {
    return process.env.SHELL || this.getDefaultShell();
  }

  getDefaultShell(): string {
    if (os.platform() === "win32") {
      return "powershell.exe";
    }
    return "bash";
  }

  sendData(_: IpcMainInvokeEvent, data: string) {
    if (!this.terminal) return;

    this.terminal.write(data);
  }

  spawnTerminal() {
    this.terminal = pty.spawn(this.shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    this.terminal.onData((e) => {
      this.window.webContents.send("terminal:updateData", e);
    });
  }

  killTerminal() {
    this.terminal?.kill();
    this.terminal = null;
  }
}
