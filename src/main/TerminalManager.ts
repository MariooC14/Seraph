/**
 * Handles user input from the browser's xterm instance.
 * Only handles one terminal instance
 */

import os from "node:os";
import * as pty from "node-pty";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import fs from "node:fs";
import { join } from "node:path";
import { getAvailableShells } from "./helpers";

export class TerminalManager {
  shell: string;
  terminal?: pty.IPty;
  window: BrowserWindow;

  public constructor(window: BrowserWindow) {
    this.window = window;
    this.shell = this.getShell();
  }

  public startListening() {
    ipcMain.handle("terminal:spawn", (_, shellPath: string) =>
      this.spawnTerminal(shellPath)
    );
    ipcMain.handle("terminal:kill", () => this.killTerminal());
    ipcMain.handle("terminal:write", (_, data: string) =>
      this.sendData(_, data)
    );
    ipcMain.handle("terminal:getUserPreferredShell", () =>
      this.getUserPreferredShell()
    );
    ipcMain.handle("terminal:getAvailableShells", () =>
      this.getAvailableShells()
    );
    ipcMain.handle("terminal:saveDefaultShell", (_, newShellPath: string) =>
      this.saveDefaultShell(newShellPath)
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

  public getUserPreferredShell() {
    const configPath = join(app.getPath("userData"), "config.json");
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify({ shell: this.shell }));
      return this.shell;
    } else {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      console.log("main", config);
      return (config.shell as string) || this.shell;
    }
  }

  public saveDefaultShell(newShellPath: string) {
    const configPath = join(app.getPath("userData"), "config.json");

    try {
      if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ shell: newShellPath }));
      } else {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        config.shell = newShellPath;
        fs.writeFileSync(configPath, JSON.stringify(config));
      }
      return true;
    } catch (error) {
      console.error("Failed to save default shell:", error);
      return false;
    }
  }

  public async getAvailableShells() {
    return await getAvailableShells(os.platform());
  }

  sendData(_: IpcMainInvokeEvent, data: string) {
    if (!this.terminal) return;

    this.terminal.write(data);
  }

  spawnTerminal(shellPath?: string) {
    this.terminal = pty.spawn(shellPath || this.shell, [], {
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
