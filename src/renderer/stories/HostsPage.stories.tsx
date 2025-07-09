import { Meta, StoryObj } from '@storybook/react-vite';
import HostsPage from '@/pages/Home/pages/hosts/hosts-page';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { fakeWindowHosts } from './mocks';
import { Button } from '@/components/ui/button';
import { addHostConfig } from '@/features/hosts/hosts-slice';

window.hosts = fakeWindowHosts;

function addRandomHost() {
  const randomHost = {
    id: `host-${Math.random().toString(36).substring(2, 15)}`,
    label: `Host ${Math.floor(Math.random() * 1000)}`,
    host: `192.168.1.${Math.floor(Math.random() * 255)}`,
    port: 22,
    username: 'user',
    password: 'password'
  };
  store.dispatch(addHostConfig(randomHost));
}

const meta = {
  component: HostsPage,
  decorators: [
    Story => (
      <Provider store={store}>
        <Button size="sm" onClick={() => addRandomHost()}>
          Add random host
        </Button>
        <div data-vaul-drawer-wrapper>
          <Story />
        </div>
      </Provider>
    )
  ]
} satisfies Meta<typeof HostsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add props here if HostsPage expects any
  }
};
