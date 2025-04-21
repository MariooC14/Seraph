import "@xterm/xterm/css/xterm.css";
import { useNavigate, useParams } from "react-router";
import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import TerminalView from "./TerminalView";
import { useEffect } from "react";

/** Renders all terminals - only hides the inactive ones. */
function TerminalPanel() {
  const { terminalId } = useParams();
  const { tabs } = useTerminalTabs();
  const navigate = useNavigate();

  useEffect(() => {
    if (tabs.length === 0) {
      navigate("/");
    } else if (terminalId && !tabs.find((tab) => tab.id === terminalId)) {
      const rightmostTab = tabs[tabs.length - 1];
      navigate(`/terminals/${rightmostTab.id}`);
    }
  }, [tabs]);
  
  return (
    <>
      {tabs.map((tab) => 
        <TerminalView key={tab.id} sessionId={tab.session.id} terminal={tab.session.terminal} visible={tab.session.id === terminalId} />
      )}
    </>
  );
}

export default TerminalPanel;