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

let fetching = false;

function toggleFetching() {
  fetching = !fetching;
  store.dispatch({ type: 'hosts/setFetching', payload: fetching });
}

const ActionButtons = () => (
  <div className="flex gap-2 mb-2">
    <Button size="sm" onClick={() => addRandomHost()}>
      Add random host
    </Button>
    <Button size="sm" onClick={() => toggleFetching()}>
      Toggle fetching
    </Button>
    <Button size="sm" onClick={() => store.dispatch({ type: 'hosts/clearHosts' })}>
      Clear hosts
    </Button>
  </div>
);

const meta = {
  component: HostsPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Story => (
      <Provider store={store}>
        <div className="h-screen p-4 flex flex-col">
          <ActionButtons />
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
