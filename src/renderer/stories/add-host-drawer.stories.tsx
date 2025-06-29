import { store } from '@/app/store';
import { AddHostDrawer } from '@/pages/Home/pages/hosts/add-host-drawer';
import { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';

const meta: Meta<typeof AddHostDrawer> = {
  title: 'Components/AddHostDialog',
  component: AddHostDrawer,
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};
export default meta;

type Story = StoryObj<typeof AddHostDrawer>;

export const Open: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onSubmit: () => alert('Host added!')
  }
};

export const Closed: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    onSubmit: () => {},
    title: '\n'
  }
};
