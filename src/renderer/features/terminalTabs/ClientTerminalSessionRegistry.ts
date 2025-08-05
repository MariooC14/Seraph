/**
 * This class is responsible for storing terminal sessions in the renderer process.
 * Redux cannot use this since terminal sessions are not serializable. Redux manages sessions using the session ids,
 * and the app will get a session using this registry.
 */
import { ClientTerminalSession } from './ClientTerminalSession';

class TerminalSessionRegistry {
  private sessions: Map<string, ClientTerminalSession | null> = new Map();

  async createLocalSession(shellPath: string) {
    return await window.terminal
      .createLocalSession(shellPath)
      .then((sessionId: string) => {
        const session = new ClientTerminalSession(sessionId, 'local');
        this.sessions.set(sessionId, session);
        return session.sessionId;
      })
      .catch(error => {
        console.error('Failed to create terminal session:', error);
        throw error;
      });
  }

  // Creates an SSH session on backend. Does not create a terminal until the connection is established.
  async createSSHSession(hostId: string) {
    return await window.terminal.createSSHSession(hostId).then(res => {
      if (res.success === true) {
        return res.data;
      } else {
        console.error('Failed to create SSH terminal session:', res.message);
        throw new Error(res.message);
      }
    });
  }

  async requestPtyForSession(sessionId: string) {
    if (this.sessions.has(sessionId)) {
      return;
    }
    try {
      await window.sshSetup.requestPty(sessionId);
      const terminalSession = new ClientTerminalSession(sessionId, 'ssh');
      this.sessions.set(sessionId, terminalSession);
    } catch (error) {
      throw new Error(`Failed to request PTY for session ${sessionId}: ${error.message}`);
    }
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
