import { useNavigate, useParams} from "react-router";
import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import TerminalView from "./TerminalView";
import { useEffect } from "react";
import {cn} from '@/lib/utils';

function TerminalPanel() {
  const { terminalId } = useParams();
  const { tabs, closeTab } = useTerminalTabs();
  const navigate = useNavigate();

  useEffect(() => {
    if (tabs.length === 0) {
      navigate("/");
    } else if (terminalId && !tabs.find((tab) => tab.id === terminalId)) {
      const rightmostTab = tabs[tabs.length - 1];
      navigate(`/terminals/${rightmostTab.id}`);
    }
  }, [tabs]);

  const handleClose = (sessionId: string) => {
    closeTab(sessionId);
  }

  return (
    <>
      {tabs.map((tab) =>
        <div key={tab.id} className={cn("p-4 h-full w-full bg-background", tab.id !== terminalId && "hidden")}>
          <TerminalView
            key={tab.id}
            clientTerminalSession={tab.session}
            onClose={handleClose}
            isVisible={tab.id === terminalId} />
        </div>
      )}
    </>
  );
}

export default TerminalPanel;
