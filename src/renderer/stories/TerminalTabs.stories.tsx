import type { Meta, StoryObj } from '@storybook/react';

import TerminalTabs from '../components/TerminalTabs/TerminalTabs';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TerminalTab } from '@/features/terminalTabs/terminalTabsSlice';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const generateTabs = (numTabs: number): TerminalTab[] => {
  return Array.from(
    { length: numTabs },
    (_, index) =>
      ({
        id: index,
        name: `Tab ${index}`,
        isActive: index === 0
      }) as any
  );
};

/** Mimick the functionality of the titlebar */
function TerminalTabsStory({ numTabs = 3 }: { numTabs: number }) {
  const [activeTab, setActiveTab] = useState('1');
  const [tabs, setTabs] = useState<TerminalTab[]>(() => generateTabs(numTabs));

  useEffect(() => {
    setTabs(generateTabs(numTabs));
    setActiveTab('1');
  }, [numTabs]);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prevTabs => {
      const filteredTabs = prevTabs.filter(tab => tab.id !== tabId);
      return filteredTabs.map((tab, idx) => {
        return {
          id: idx,
          name: `Tab ${idx}`
        } as any;
      });
    });
  };

  const handleNewTabClick = () => {
    const newTab: TerminalTab = {
      id: `${tabs.length + 1}`,
      name: `Tab ${tabs.length + 1}`
    };
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTab(newTab.id);
  };

  return (
    <div className="flex">
      <TerminalTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabSelect={tabId => handleTabSelect(tabId)}
        onTabClose={tabId => handleTabClose(tabId)}
      />
      <Button size="icon" variant="ghost" onClick={handleNewTabClick}>
        <Plus />
      </Button>
    </div>
  );
}

const meta = {
  component: TerminalTabsStory,
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
} satisfies Meta<typeof TerminalTabsStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { numTabs: 10 }
};

export const Overflowing: Story = {
  args: { numTabs: 10 },
  decorators: [
    Story => (
      <div
        style={{
          width: '500px',
          height: '100px',
          border: '1px solid red'
        }}>
        <Story />
      </div>
    )
  ]
};
