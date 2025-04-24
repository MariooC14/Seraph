import { Button } from "../ui/button";
import { Home, Plus } from "lucide-react";
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
    <nav className="draggable flex justify-between select-none text-muted-foreground h-10 max-w-screen overflow-x-hidden">
      <div className={cn("flex items-center overflow-hidden", isMacOS ? "ml-18" : "ml-1")}>
        <div className="flex overflow-hidden">
          <Link to="/">
            <Button className="cursor-pointer nonDraggable" variant="ghost" size="icon">
              <Home />
            </Button>
          </Link>
          <div className="overflow-hidden my-1 ml-2">
          <TerminalTabs tabs={tabs} onTabSelect={handleTabSelect} onTabClose={handleTabClose} activeTab={terminalId} onNewTabClick={handleNewTabClick}/>
          </div>
        </div>
          <Button variant="ghost" size="icon" className="cursor-pointer nonDraggable rounded-full size-8 ml-1" onClick={handleNewTabClick}>
            <Plus />
          </Button>
      </div>
      {!isMacOS && <WindowControlBar />}
    </nav>
  );
}
