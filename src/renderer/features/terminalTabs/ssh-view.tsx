import { TerminalPanelProps } from './terminal-panel';
import TerminalView from './terminal-view';

export function SSHView(props: TerminalPanelProps) {
  if (props.clientTerminalSession) {
    return <TerminalView {...props} />;
  }

  return <>SSH Connection View somehow</>;
}
