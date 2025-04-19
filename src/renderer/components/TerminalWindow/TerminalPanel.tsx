import "@xterm/xterm/css/xterm.css";
import { Navigate, useParams } from "react-router";
import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import TerminalView from "./TerminalView";

/** Renders all terminals - only hides the inactive ones. */
function TerminalPanel() {
  const { terminalId } = useParams();
  const { tabs } = useTerminalTabs();

  if (terminalId && tabs.length === 0) {
    return <Navigate to="/" />;
  }
  
  return (
    <>
      {tabs.map((tab) => 
        <TerminalView key={tab.id} sessionId={tab.session.id} terminal={tab.session.terminal} visible={tab.session.id === terminalId} />
      )}
    </>
  );
}

export default TerminalPanel;