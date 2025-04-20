import { Button } from "../ui/button";
import { Home, Plus } from "lucide-react";
import WindowControlBar from "../WindowControlBar";
import CloseableTab from "../NavigationBar/CloseableTab";
import { Link } from "react-router";
import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TitleBar() {
  const { tabs, showHostSelectionDialog } = useTerminalTabs();
  const [isMacOS] = useState(() => window.app.isMacOS())

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

          <div className="flex space-x-1">
            {tabs?.map((tab) => (
              <CloseableTab key={tab.id} id={tab.id} name={tab.name} />
            ))}
          </div>

          <Button variant="ghost" size="icon" className="cursor-pointer nonDraggable rounded-full size-8" onClick={handleNewTabClick}>
            <Plus />
          </Button>
        </div>
        {!isMacOS && <WindowControlBar />}
      </nav>
  );
}
