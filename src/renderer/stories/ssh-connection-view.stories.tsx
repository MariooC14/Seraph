import { Meta, StoryObj } from '@storybook/react';
import SSHConnectionView from '@/features/terminalTabs/ssh-connection/ssh-connection-view';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { fakeWindowHosts } from './mocks';
import { addHostConfig } from '@/features/hosts/hosts-slice';

window.sshSetup = {
  connect: () => Promise.resolve({ success: true, data: true })
};
window.hosts = fakeWindowHosts;
store.dispatch(addHostConfig({ host: 'example.com', label: 'Example Host', port: 22 }));

const meta = {
  component: SSHConnectionView,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof SSHConnectionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: Story => (
    <Provider store={store}>
      <Story args={{ sessionId: 'session-id', onConnect: () => {} }} />
    </Provider>
  ),
  args: {
    sessionId: 'session-id',
    hostId: 'example.com',
    onConnect: () => console.log('Connected successfully')
  }
};
