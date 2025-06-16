import { Meta, StoryObj } from '@storybook/react-vite';
import HostsPage from '@/pages/Home/pages/hosts/hosts-page';

const meta = {
  component: HostsPage,
  decorators: [
    Story => (
      <div data-vaul-drawer-wrapper>
        <Story />
      </div>
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
