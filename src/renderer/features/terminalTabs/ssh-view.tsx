import { terminalSessionRegistry } from './ClientTerminalSessionRegistry';
import SSHConnectionDialog from './ssh-connection/ssh-connection-view';
import { TerminalPanelProps } from './terminal-panel';
import TerminalView from './terminal-view';
import { useState } from 'react';

export function SSHView(props: TerminalPanelProps) {
  const clientTerminalSession = terminalSessionRegistry.getSession(props.sessionId);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    terminalSessionRegistry.createPtyForSession(props.sessionId);
    setConnected(true);
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
