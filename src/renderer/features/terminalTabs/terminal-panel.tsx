import { ClientTerminalSession } from './ClientTerminalSession';
import { SSHView } from './ssh-view';
import TerminalView from './terminal-view';

export type TerminalPanelProps = {
  clientTerminalSession: ClientTerminalSession;
  onClose: (sessionId: string) => void;
  isVisible: boolean;
};

function TerminalPanel(props: TerminalPanelProps) {
  if (props.clientTerminalSession.type == 'local') {
    return <TerminalView {...props} />;
  } else {
    return <SSHView {...props} />;
  }
}

export default TerminalPanel;
