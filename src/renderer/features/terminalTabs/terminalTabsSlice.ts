import { createAppSlice } from "@/app/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { terminalSessionRegistry } from "./ClientTerminalSessionRegistry";
import { RootState } from "@/app/store";

export type TerminalTab = {
  /** id is also sessionId */
  id: string;
  name: string;
};

export type TerminalTabsSliceState = {
  tabs: TerminalTab[];
  isHostSelectionDialogOpen: boolean;
};

type CreateTabParams = {
  name: string;
  shellPath?: string;
};

const initialState: TerminalTabsSliceState = {
  tabs: [],
  isHostSelectionDialogOpen: false,
};

export const terminalTabsSlice = createAppSlice({
  name: "terminalTabs",
  initialState,
  reducers: create => ({
    closeTab: create.reducer((state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      const tabToClose = state.tabs.find(tab => tab.id === sessionId);
      if (tabToClose) {
        terminalSessionRegistry.terminateSession(sessionId);
        state.tabs = state.tabs.filter(tab => tab.id !== sessionId);
      }
    }),
    createTab: create.asyncThunk(
      async (params: CreateTabParams, { getState }) => {
        const state = getState() as RootState;
        const { name, shellPath = state.config.defaultShellPath } = params;
        const newSessionId = await terminalSessionRegistry.createSession(
          shellPath
        );
        const tab: TerminalTab = {
          id: newSessionId,
          name: name,
        };
        return tab;
      },
      {
        fulfilled: (state, action: PayloadAction<TerminalTab>) => {
          state.tabs.push(action.payload);
        },
        rejected: (_, action) => {
          console.error("Failed to create terminal tab:", action.error.message);
        },
      }
    ),
    toggleHostSelectionDialog: create.reducer(state => {
      state.isHostSelectionDialogOpen = !state.isHostSelectionDialogOpen;
    }),
  }),
  selectors: {
    selectTerminalTabs: terminalTabs => terminalTabs.tabs,
    selectIsHostSelectionDialogOpen: terminalTabs =>
      terminalTabs.isHostSelectionDialogOpen,
  },
});

// Action creators are generated for each case reducer function
export const { createTab, closeTab, toggleHostSelectionDialog } =
  terminalTabsSlice.actions;

export const { selectTerminalTabs, selectIsHostSelectionDialogOpen } =
  terminalTabsSlice.selectors;

export default terminalTabsSlice.reducer;
