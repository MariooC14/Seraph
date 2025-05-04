import type { Meta, StoryObj } from '@storybook/react';

import TerminalView from '@/features/terminalTabs/TerminalView';
import { ITerminalOptions } from '@xterm/xterm';
import createSimpleMockTerminal from './mockTerminalEnvironment';
import { defaultTerminalOptions } from '@/features/terminalTabs/terminalConfig';
import { useState } from 'react';
import { ClientTerminalSession } from '@/features/terminalTabs/ClientTerminalSession';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

type TerminalViewPropsAndTerminalOptions = React.ComponentProps<typeof TerminalView> & ITerminalOptions & { themeKey: keyof typeof themeOptions };

window.terminal = createSimpleMockTerminal() as any;

const themeOptions = {
  'Default': defaultTerminalOptions.theme,
  'Dark': {
    background: '#121212',
    foreground: '#f0f0f0',
    cursor: '#ffffff',
    cursorAccent: '#000000',
    selection: 'rgba(255, 255, 255, 0.3)',
  },
  'Light': {
    background: '#ffffff',
    foreground: '#333333',
    cursor: '#000000',
    cursorAccent: '#ffffff',
    selection: 'rgba(0, 0, 0, 0.3)',
  },
  'Monokai': {
    background: '#272822',
    foreground: '#F8F8F2',
    cursor: '#F8F8F2',
    cursorAccent: '#272822',
    selection: 'rgba(73, 72, 62, 0.9)',
  },
  'Solarized Dark': {
    background: '#002B36',
    foreground: '#839496',
    cursor: '#93A1A1',
    cursorAccent: '#002B36',
    selection: 'rgba(7, 54, 66, 0.99)',
  }
};

const meta = {
  component: TerminalView,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ]
} satisfies Meta<TerminalViewPropsAndTerminalOptions>;

export default meta;

type Story = StoryObj<TerminalViewPropsAndTerminalOptions>;

export const Presets: Story = {
  render: (args) => {
    // Maintain terminal when changing props but create new when switching stories
    const [terminal] = useState(new ClientTerminalSession("mock-session-id"));
    const { themeKey, ...rest } = args;

    terminal.terminalOptions.theme = themeOptions[themeKey || 'Default'];
    terminal.terminalOptions = rest;

    return <TerminalView {...args} clientTerminalSession={terminal} />
  },
  argTypes: {
    themeKey: {
      control: 'select',
      options: Object.keys(themeOptions),
      defaultValue: 'Default',
      name: 'Theme',
      description: 'Select a theme preset',
    },
    theme: {
      control: {
        type: 'object',
        disable: true,
      },
    },
    fontSize: {
      control: {
        type: "range",
        min: 1,
        max: 50,
        step: 1,
      }
    },
    cursorBlink: {
      control: 'boolean',
    },
    cursorStyle: {
      control: 'select',
      options: ['block', 'underline', 'bar'],
    },
    fontFamily: {
      control: 'text',
    },
    fontWeight: {
      control: {
        type: "range",
        min: 200,
        max: 800,
        step: 25,
      },
      defaultValue: defaultTerminalOptions.fontWeight,
    },
  },
  args: {
    // Terminal specific
    themeKey: 'Default',
    fontSize: defaultTerminalOptions.fontSize,
    allowProposedApi: defaultTerminalOptions.allowProposedApi,
    cursorBlink: defaultTerminalOptions.cursorBlink,
    cursorStyle: defaultTerminalOptions.cursorStyle,
    fontFamily: defaultTerminalOptions.fontFamily,
    fontWeight: defaultTerminalOptions.fontWeight,
  }
};
