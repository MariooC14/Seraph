import type { Meta, StoryObj } from '@storybook/react';

import TerminalTabs from '../components/TerminalTabs/TerminalTabs';
import { TerminalTab } from '@/context/TerminalTabsProvider';
import { useEffect, useState } from 'react';

const generateTabs = (numTabs: number): TerminalTab[] => {
  return Array.from({ length: numTabs }, (_, index) => ({
    id: `${index + 1}`,
    name: `Tab ${index + 1}`,
    isActive: false
  } as any));
}

/** Mimick the functionality of the titlebar */
function TerminalTabsStory({ numTabs = 3 }: { numTabs: number }) {
  const [activeTab, setActiveTAb] = useState('1');
  const [tabs, setTabs] = useState<TerminalTab[]>(() => generateTabs(numTabs));

  useEffect(() => {
    setTabs(generateTabs(numTabs));
    setActiveTAb('1');
  }, [numTabs])

  const handleTabSelect = (tabId: string) => {
    setActiveTAb(tabId);
  };

  const handleTabClose = (tabId: string) => {
    setTabs((prevTabs) => {
      const filteredTabs = prevTabs.filter((tab) => tab.id !== tabId);
      return filteredTabs.map((tab, idx) => {
        return { 
          id: `${idx + 1}`, 
          name: `Tab ${idx + 1}`, 
          } as any
      })
  });
  };

  const handleNewTabClick = () => {
    const newTab: TerminalTab = {
      id: `${tabs.length + 1}`,
      name: `Tab ${tabs.length + 1}`,
      session: { id: `${tabs.length + 1}` } as any,
      isActive: false
    };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTAb(newTab.id);
  };

  return (
    <TerminalTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabSelect={(tabId) => handleTabSelect(tabId)}
      onTabClose={(tabId) => handleTabClose(tabId)}
      onNewTabClick={() => handleNewTabClick()}
    />
  );
}

const meta = {
  component: TerminalTabsStory,
} satisfies Meta<typeof TerminalTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { numTabs: 5 }
}