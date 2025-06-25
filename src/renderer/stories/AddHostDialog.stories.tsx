// AddHostDialog.stories.tsx

import { store } from '@/app/store';
import { Meta, StoryObj } from '@storybook/react';
import { AddHostDialog } from '@/features/AddHostDialog';
import { Provider } from 'react-redux';

// Optionally, import any providers your dialog needs
// import { Provider } from 'react-redux';
// import { store } from '@/app/store';

const meta: Meta<typeof AddHostDialog> = {
  title: 'Components/AddHostDialog',
  component: AddHostDialog,
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    )
  ]
};
export default meta;

type Story = StoryObj<typeof AddHostDialog>;

export const Open: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onSubmit: () => alert('Host added!')
  }
};

export const Closed: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onSubmit: () => {},
    title: 'dddd\n'
  }
};
