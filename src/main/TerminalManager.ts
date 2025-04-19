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
import { v4 as uuidv4 } from "uuid";

type TerminalSessionStore = Record<string, pty.IPty>;

export class TerminalManager {
  shell: string;
  terminal?: pty.IPty;
  window: BrowserWindow;
  sessions: TerminalSessionStore = {};

  public constructor(window: BrowserWindow) {
    this.window = window;
    this.shell = this.getShell();
  }

  public startListening() {
    ipcMain.handle("terminal:spawn", (_event, shellPath: string) => {
      console.log("Spawning new terminal with shell path:", shellPath);
      this.spawnTerminal(shellPath);
    });
    ipcMain.handle("terminal:resize", (_, event: ClientResizeEvent) => {
      this.resizeTerminal(event);
    });
    ipcMain.handle("terminal:kill", (_, sessionId: string) =>
      this.killTerminal(sessionId)
    );
    ipcMain.handle("terminal:write", (_, event: ClientWriteEvent) => {
      this.sendData(_, event);
    });
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

  sendData(_: IpcMainInvokeEvent, event: ClientWriteEvent) {
    if (!this.sessions[event.sessionId]) {
      console.error("No terminal session found for ID:", event.sessionId);
      return;
    }
    console.log("Sending data to terminal:", event.sessionId);
    this.sessions[event.sessionId].write(event.newData);
  }

  spawnTerminal(shellPath?: string) {
    const newSessionId = uuidv4();
    const newTerminal = pty.spawn(shellPath || this.shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    this.sessions[newSessionId] = newTerminal;

    newTerminal.onData((newData) => {
      console.log("Received data from session:", newSessionId);
      const payload: TerminalDataEvent = {
        newData,
        sessionId: newSessionId,
      };
      this.window.webContents.send("terminal:updateData", payload);
    });
    // The rendeerer's Terminal Service which invoked this function is listening for this event
    this.window.webContents.send("terminal:newSession", newSessionId);
  }

  resizeTerminal(event: ClientResizeEvent) {
    console.log("Resizing terminal:", event.sessionId);
    if (!this.sessions[event.sessionId]) return;

    this.sessions[event.sessionId].resize(event.cols, event.rows);
  }

  killTerminal(sessionId: string) {
    console.log("Killing terminal with id:", sessionId);
    if (!this.sessions[sessionId]) return;

    this.sessions[sessionId].kill();
    delete this.sessions[sessionId];
  }

  public killAllTerminals() {
    console.log("Killing all terminals");
    for (const sessionId in this.sessions) {
      this.killTerminal(sessionId);
    }
    this.sessions = {};
  }
}
