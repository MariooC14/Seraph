import { createAppSlice } from '@/app/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { terminalSessionRegistry } from './ClientTerminalSessionRegistry';
import { AppThunk } from '@/app/store';

export type TerminalTab = {
  /** id is also sessionId */
  id: string;
  type: 'local' | 'ssh';
  name: string;
};

export type TerminalTabsSliceState = {
  focusedTabId?: string;
  focusedTabIdx: number | null;
  tabs: TerminalTab[];
  isHostSelectionDialogOpen: boolean;
};

const initialState: TerminalTabsSliceState = {
  tabs: [],
  isHostSelectionDialogOpen: false,
  focusedTabIdx: null
};

export const terminalTabsSlice = createAppSlice({
  name: 'terminalTabs',
  initialState,
  reducers: {
    closeTab: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      const tabToClose = state.tabs.find(tab => tab.id === sessionId);
      if (!tabToClose) return;

      terminalSessionRegistry.terminateSession(sessionId);
      state.tabs = state.tabs.filter(tab => tab.id !== sessionId);
      if (state.tabs.length > 0) {
        state.focusedTabIdx = state.tabs.length - 1;
        state.focusedTabId = state.tabs[state.focusedTabIdx].id;
      } else {
        // Focus back on home page
        state.focusedTabIdx = null;
        state.focusedTabId = null;
      }
    },
    addTab: (state, action: PayloadAction<TerminalTab>) => {
      state.tabs.push(action.payload);
    },
    toggleHostSelectionDialog: state => {
      state.isHostSelectionDialogOpen = !state.isHostSelectionDialogOpen;
    },
    focusTab: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const tabIdx = state.tabs.findIndex(tab => tab.id === tabId);
      if (tabIdx !== -1) {
        state.focusedTabId = state.tabs[tabIdx].id;
        state.focusedTabIdx = tabIdx;
      }
    },
    cycleNextTab: state => {
      if (state.tabs.length === 0) return;
      if (state.focusedTabIdx === null) {
        // If no tab was previously focused, set the first tab as focused
        state.focusedTabIdx = -1;
      }
      const nextIndex = (state.focusedTabIdx + 1) % state.tabs.length;
      state.focusedTabIdx = nextIndex;
      state.focusedTabId = state.tabs[nextIndex].id;
    },
    cyclePreviousTab: state => {
      if (state.tabs.length === 0) return;
      if (state.focusedTabIdx === null) {
        state.focusedTabIdx = state.tabs.length - 1;
      }
      const prevIndex = (state.focusedTabIdx - 1 + state.tabs.length) % state.tabs.length;
      state.focusedTabIdx = prevIndex;
      state.focusedTabId = state.tabs[prevIndex].id;
    },
    unfocusTabs: state => {
      state.focusedTabId = null;
      state.focusedTabIdx = null;
    }
  },
  selectors: {
    selectTerminalTabs: terminalTabs => terminalTabs.tabs,
    selectIsHostSelectionDialogOpen: terminalTabs => terminalTabs.isHostSelectionDialogOpen,
    selectFocusedTabId: terminalTabs => terminalTabs.focusedTabId
  }
});

export function createLocalTerminalTab(name: string, shellPath: string): AppThunk {
  return async dispatch => {
    const newSessionId = await terminalSessionRegistry.createLocalSession(shellPath);
    const tab: TerminalTab = { id: newSessionId, name, type: 'local' };
    dispatch(addTab(tab));
    dispatch(focusTab(newSessionId));
  };
}

export function createSSHTerminalTab(name: string, hostId: string): AppThunk {
  return async dispatch => {
    const newSessionId = await terminalSessionRegistry.createSSHSession(hostId);
    const tab: TerminalTab = { id: newSessionId, name, type: 'ssh' };
    dispatch(addTab(tab));
    dispatch(focusTab(newSessionId));
  };
}

const { addTab } = terminalTabsSlice.actions;
export const {
  closeTab,
  toggleHostSelectionDialog,
  focusTab,
  unfocusTabs,
  cycleNextTab,
  cyclePreviousTab
} = terminalTabsSlice.actions;

export const { selectTerminalTabs, selectIsHostSelectionDialogOpen, selectFocusedTabId } =
  terminalTabsSlice.selectors;

export default terminalTabsSlice.reducer;
