import { Button } from "../ui/button";
import { Home, Plus } from "lucide-react";
import WindowControlBar from "../WindowControlBar";
import { Link, useParams } from "react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TerminalTabs from "../TerminalTabs/TerminalTabs";
import QuickShellSelectNewTabButton from "./QuickShellSelectNewTabButton";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { closeTab, focusTab, selectTerminalTabs, toggleHostSelectionDialog } from "@/features/terminalTabs/terminalTabsSlice";

export default function TitleBar() {
  const tabs = useAppSelector(selectTerminalTabs);
  const dispatch = useAppDispatch();
  const [isMacOS] = useState(() => window.app.isMacOS());
  const { terminalId } = useParams();

  const handleTabSelect = (tabId: string) => {
    dispatch(focusTab(tabId));
  };
  const handleTabClose = (tabId: string) => {
    dispatch(closeTab(tabId));
  }

  const handleNewTabClick = () => {
    dispatch(toggleHostSelectionDialog());
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
            <TerminalTabs tabs={tabs} onTabSelect={handleTabSelect} onTabClose={handleTabClose} activeTab={terminalId} onNewTabClick={handleNewTabClick} />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="cursor-pointer nonDraggable size-7 rounded-e-none ml-1 border-r-1" onClick={handleNewTabClick}>
          <Plus />
        </Button>
        <QuickShellSelectNewTabButton />
      </div>
      {!isMacOS && <WindowControlBar />}
    </nav>
  );
}
