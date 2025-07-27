import { Meta, StoryObj } from '@storybook/react';
import SSHConnectionView from '@/features/terminalTabs/ssh-connection-view';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { fakeWindowHosts } from './mocks';
import { addHostConfig } from '@/features/hosts/hosts-slice';

window.sshSetup = {
  connect: () => Promise.resolve(true) as unknown as IPCPromise<boolean>
};
window.hosts = fakeWindowHosts;
store.dispatch(
  addHostConfig({ host: 'example.com', label: 'Example Host', port: 22, username: 'user' })
);

const meta: Meta<typeof SSHConnectionView> = {
  component: SSHConnectionView,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof SSHConnectionView>;

export const Default: Story = {
  decorators: Story => (
    <Provider store={store}>
      <Story args={{ sessionId: 'session-id', onConnect: () => {} }} />
    </Provider>
  ),
  args: {}
};
