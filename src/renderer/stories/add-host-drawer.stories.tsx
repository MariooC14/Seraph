import { store } from '@/app/store';
import { HostConfigDrawer } from '@/pages/Home/pages/hosts/host-config-drawer';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';

const meta: Meta<typeof HostConfigDrawer> = {
  component: HostConfigDrawer,
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};
export default meta;

type Story = StoryObj<typeof HostConfigDrawer>;

export const AddMode: Story = {
  args: {
    mode: 'add',
    open: true,
    onOpenChange: () => {},
    onSubmit: () => alert('Host added!')
  }
};

export const EditMode: Story = {
  args: {
    mode: 'edit',
    open: true,
    onOpenChange: () => {},
    onUpdate: () => alert('Host updated!'),
    onDelete: () => alert('Host deleted!'),
    hostConfig: {
      id: '1',
      label: 'My Server',
      host: '192.168.1.100',
      port: 22,
      username: 'admin'
    }
  }
};
