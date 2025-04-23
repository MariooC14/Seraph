import { Button } from "../ui/button";
import { Home } from "lucide-react";
import WindowControlBar from "../WindowControlBar";
import { Link, useNavigate, useParams } from "react-router";
import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TerminalTabs from "../TerminalTabs/TerminalTabs";

export default function TitleBar() {
  const { tabs, showHostSelectionDialog, closeTab } = useTerminalTabs();
  const [isMacOS] = useState(() => window.app.isMacOS());
  const { terminalId } = useParams();
  const navigate = useNavigate();

  const handleTabSelect = (tabId: string) => {
    navigate(`/terminals/${tabId}`);
  };
  const handleTabClose = (tabId: string) => {
    closeTab(tabId);
  }

  const handleNewTabClick = () => {
    showHostSelectionDialog();
  };

  return (
    <nav className="draggable flex justify-between select-none text-muted-foreground h-10">
      <div className={cn("flex items-center space-x-2", isMacOS ? "ml-18" : "ml-1")}>
        <Link to="/">
          <Button className="cursor-pointer nonDraggable" variant="ghost" size="icon">
            <Home />
          </Button>
        </Link>
        <TerminalTabs tabs={tabs} onTabSelect={handleTabSelect} onTabClose={handleTabClose} activeTab={terminalId} onNewTabClick={handleNewTabClick}/>
      </div>
      {!isMacOS && <WindowControlBar />}
    </nav>
  );
}
