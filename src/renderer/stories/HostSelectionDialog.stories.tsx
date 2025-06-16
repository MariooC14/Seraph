import type { Meta, StoryObj } from '@storybook/react-vite';

import HostSelectionDialog from '@/features/terminalTabs/HostSelectionDialog';
import { HashRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const meta = {
  component: HostSelectionDialog,
  decorators: [
    Story => (
      <HashRouter>
        <Provider store={store}>
          <Story />
        </Provider>
      </HashRouter>
    )
  ]
} satisfies Meta<typeof HostSelectionDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    handleOpenChange: () => {}
  }
};
