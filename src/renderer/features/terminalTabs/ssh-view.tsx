import { terminalSessionRegistry } from './ClientTerminalSessionRegistry';
import SSHConnectionDialog from './ssh-connection/ssh-connection-view';
import { TerminalPanelProps } from './terminal-panel';
import TerminalView from './terminal-view';
import { useState } from 'react';

export function SSHView(props: TerminalPanelProps) {
  const clientTerminalSession = terminalSessionRegistry.getSession(props.sessionId);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    try {
      await terminalSessionRegistry.requestPtyForSession(props.sessionId);
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect to SSH session:', error);
      // Handle error appropriately, e.g., show a notification or alert
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {clientTerminalSession && (
        <TerminalView {...props} clientTerminalSession={clientTerminalSession} />
      )}

      {!connected && (
        <SSHConnectionDialog
          sessionId={props.sessionId}
          hostId={props.hostId}
          onConnect={() => handleConnect()}
        />
      )}
    </div>
  );
}
