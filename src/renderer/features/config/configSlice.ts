import { createAppSlice } from "@/app/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "@/app/store";

export type ConfigState = {
  defaultShellPath: string;
  availableShells: string[];
  status: "success" | "error" | "loading";
};

const initialState: ConfigState = {
  defaultShellPath: "",
  availableShells: [],
  status: "success",
};

const configSlice = createAppSlice({
  name: "config",
  initialState,
  reducers: {
    updatePreferredShellPath: (state, action: PayloadAction<string>) => {
      state.defaultShellPath = action.payload;
    },
    updateAvailableShells: (state, action: PayloadAction<string[]>) => {
      state.availableShells = action.payload;
    },
  },
  selectors: {
    selectPreferredShellPath: state => state.defaultShellPath,
    selectAvailableShells: state => state.availableShells,
  },
});

export const { updatePreferredShellPath, updateAvailableShells } =
  configSlice.actions;

export const { selectAvailableShells, selectPreferredShellPath } =
  configSlice.selectors;

export function fetchAvailableShells(): AppThunk {
  return async dispatch => {
    const shells = await window.terminal.getAvailableShells();
    console.log("Available shells:", shells);
    dispatch(updateAvailableShells(shells));
  };
}

export function initializeConfigState(): AppThunk {
  return async dispatch => {
    const preferredShellPath = await window.terminal.getUserPreferredShell();
    dispatch(updatePreferredShellPath(preferredShellPath));
    dispatch(fetchAvailableShells());
  };
}

export default configSlice.reducer;
