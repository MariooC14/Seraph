import { TerminalTab } from '@/features/terminalTabs/terminalTabsSlice';
import CloseableTab from '../NavigationBar/CloseableTab';

interface TerminalTabsProps {
  tabs: TerminalTab[];
  activeTab?: string;
  onTabSelect?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTabClick?: () => void;
}

export default function TerminalTabs({
  tabs,
  activeTab,
  onTabSelect,
  onTabClose
}: TerminalTabsProps) {
  return (
    <div className="flex space-x-2 h-full overflow-auto scrollbar-hidden">
      {tabs?.map(tab => (
        <CloseableTab
          key={tab.id}
          id={tab.id}
          name={tab.name}
          isActive={tab.id === activeTab}
          onClick={() => onTabSelect?.(tab.id)}
          onClose={() => onTabClose?.(tab.id)}
        />
      ))}
    </div>
  );
}
