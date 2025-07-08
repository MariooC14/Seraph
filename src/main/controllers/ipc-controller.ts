/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain } from 'electron';

/**
 * Base class for IPC controllers.
 * An IPC controller is responsible for handling IPC messages, like the controller in an MVC architecture.
 * Ideally we would have decorators for each handler (like in spring boot), but that's work in progress.
 */
export abstract class IpcController {
  private readonly handlers: Map<string, (...args: any[]) => any> = new Map();

  constructor(protected baseChannel: string) {}

  startListening() {
    this.handlers.forEach((handler, channel) => {
      ipcMain.handle(`${this.baseChannel}:${channel}`, (_event, ...args) => handler(...args));
    });
    return this;
  }

  protected addHandler<T>(channel: string, handler: (...args: any[]) => T): void {
    this.handlers.set(channel, handler);
  }

  stopListening(): void {
    this.handlers.forEach((_, channel) => {
      ipcMain.removeHandler(`${this.baseChannel}:${channel}`);
    });
    this.handlers.clear();
  }
}
