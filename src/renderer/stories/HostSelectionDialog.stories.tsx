import type { Meta, StoryObj } from '@storybook/react';

import HostSelectionDialog from '../context/TerminalTabsProvider/HostSelectionDialog';
import { HashRouter } from 'react-router';

const meta = {
  component: HostSelectionDialog,
  decorators: [
    (Story) => (
      <HashRouter>
        <Story />
      </HashRouter>
    ),
  ]
} satisfies Meta<typeof HostSelectionDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    handleOpenChange: () => {},
  }
};