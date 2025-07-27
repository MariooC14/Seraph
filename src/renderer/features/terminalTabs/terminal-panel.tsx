import { terminalSessionRegistry } from './ClientTerminalSessionRegistry';
import { SSHView } from './ssh-view';
import TerminalView from './terminal-view';

export type TerminalPanelProps = {
  sessionId: string;
  hostId?: string;
  onClose: (sessionId: string) => void;
  isVisible: boolean;
};

function TerminalPanel(props: TerminalPanelProps) {
  const terminalSession = terminalSessionRegistry.getSession(props.sessionId);
  if (terminalSession?.type === 'local') {
    return <TerminalView {...props} clientTerminalSession={terminalSession} />;
  } else {
    return <SSHView {...props} />;
  }
}

export default TerminalPanel;
