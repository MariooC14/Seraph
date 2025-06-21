import { createAppSlice } from '@/app/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { terminalSessionRegistry } from './ClientTerminalSessionRegistry';
import { RootState } from '@/app/store';
import { toast } from 'sonner';

export type TerminalTab = {
  /** id is also sessionId */
  id: string;
  name: string;
};

export type TerminalTabsSliceState = {
  focusedTabId?: string;
  focusedTabIdx: number | null;
  tabs: TerminalTab[];
  isHostSelectionDialogOpen: boolean;
};

interface BaseCreateTabParams {
  name: string;
  type: 'local' | 'ssh';
}

interface LocalTerminalTabParams extends BaseCreateTabParams {
  type: 'local';
  shellPath?: string;
}

interface SSHTabParams extends BaseCreateTabParams {
  type: 'ssh';
  hostId: string;
}

const initialState: TerminalTabsSliceState = {
  tabs: [],
  isHostSelectionDialogOpen: false,
  focusedTabIdx: null
};

export const terminalTabsSlice = createAppSlice({
  name: 'terminalTabs',
  initialState,
  reducers: create => ({
    closeTab: create.reducer((state, action: PayloadAction<string>) => {
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
    }),
    createTab: create.asyncThunk(
      async (params: LocalTerminalTabParams | SSHTabParams, { getState }) => {
        const state = getState() as RootState;
        if (params.type === 'ssh') {
          const { name, hostId } = params;
          const newSessionId = await terminalSessionRegistry.createSSHSession(hostId);
          const tab: TerminalTab = {
            id: newSessionId,
            name: name
          };
          return tab;
        } else {
          const { name, shellPath = state.config.defaultShellPath } = params;
          const newSessionId = await terminalSessionRegistry.createLocalSession(shellPath);
          const tab: TerminalTab = {
            id: newSessionId,
            name: name
          };
          return tab;
        }
      },
      {
        fulfilled: (state, action: PayloadAction<TerminalTab>) => {
          state.tabs.push(action.payload);
          state.focusedTabId = action.payload.id;
          state.focusedTabIdx = state.tabs.length - 1;
        },
        rejected: (_, action) => {
          toast.error(action.error.message);
        }
      }
    ),
    toggleHostSelectionDialog: create.reducer(state => {
      state.isHostSelectionDialogOpen = !state.isHostSelectionDialogOpen;
    }),
    focusTab: create.reducer((state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const tabIdx = state.tabs.findIndex(tab => tab.id === tabId);
      if (tabIdx !== -1) {
        state.focusedTabId = state.tabs[tabIdx].id;
        state.focusedTabIdx = tabIdx;
      }
    }),
    cycleNextTab: create.reducer(state => {
      if (state.tabs.length === 0) return;
      if (state.focusedTabIdx === null) {
        // If no tab was previously focused, set the first tab as focused
        state.focusedTabIdx = -1;
      }
      const nextIndex = (state.focusedTabIdx + 1) % state.tabs.length;
      state.focusedTabIdx = nextIndex;
      state.focusedTabId = state.tabs[nextIndex].id;
    }),
    cyclePreviousTab: create.reducer(state => {
      if (state.tabs.length === 0) return;
      if (state.focusedTabIdx === null) {
        state.focusedTabIdx = state.tabs.length - 1;
      }
      const prevIndex = (state.focusedTabIdx - 1 + state.tabs.length) % state.tabs.length;
      console.log(prevIndex);
      state.focusedTabIdx = prevIndex;
      state.focusedTabId = state.tabs[prevIndex].id;
    }),
    unfocusTabs: create.reducer(state => {
      state.focusedTabId = null;
      state.focusedTabIdx = null;
    })
  }),
  selectors: {
    selectTerminalTabs: terminalTabs => terminalTabs.tabs,
    selectIsHostSelectionDialogOpen: terminalTabs => terminalTabs.isHostSelectionDialogOpen,
    selectFocusedTabId: terminalTabs => terminalTabs.focusedTabId
  }
});

// Action creators are generated for each case reducer function
export const {
  createTab,
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
