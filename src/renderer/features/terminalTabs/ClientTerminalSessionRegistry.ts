/**
 * This class is responsible for storing terminal sessions in the renderer process.
 * Redux cannot use this since terminal sessions are not serializable. Redux manages sessions using the session ids,
 * and the app will get a session using this registry.
 */

import { ClientTerminalSession } from './ClientTerminalSession';

class TerminalSessionRegistry {
  private sessions: Map<string, ClientTerminalSession> = new Map();

  constructor() {
    // Initialize if needed
  }

  async createSession(shellPath: string) {
    console.log('Creating new terminal with shell path:', shellPath);
    return await window.terminal
      .createSession(shellPath)
      .then((sessionId: string) => {
        console.log('New terminal sessionId:', sessionId);
        const session = new ClientTerminalSession(sessionId);
        this.sessions.set(sessionId, session);
        return session.sessionId;
      })
      .catch(error => {
        console.error('Failed to create terminal session:', error);
        throw error;
      });
  }

  getSession(id: string) {
    return this.sessions.get(id);
  }

  terminateSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.terminate();
      this.sessions.delete(sessionId);
      return true;
    }
    return false;
  }
}

export const terminalSessionRegistry = new TerminalSessionRegistry();
