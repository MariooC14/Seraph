import { TerminalTab } from "@/context/TerminalTabsProvider";
import CloseableTab from "../NavigationBar/CloseableTab";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface TerminalTabsProps {
  tabs: TerminalTab[];
  activeTab?: string;
  onTabSelect?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTabClick?: () => void;
}

export default function TerminalTabs({ tabs, activeTab, onTabSelect, onTabClose, onNewTabClick }: TerminalTabsProps) {

  return (
    <div className="flex space-x-1">
      {tabs?.map((tab) => (
        <CloseableTab
          key={tab.id}
          id={tab.id}
          name={tab.name}
          isActive={tab.id === activeTab}
          onClick={() => onTabSelect?.(tab.id)}
          onClose={() => onTabClose?.(tab.id)}
        />
      ))}
      <Button variant="ghost" size="icon" className="cursor-pointer nonDraggable rounded-full size-8" onClick={onNewTabClick}>
        <Plus />
      </Button>
    </div>
  );
}
