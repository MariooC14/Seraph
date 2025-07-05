import { createAppSlice } from '@/app/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/app/store';
import { HostConfig } from '@dts/host-config';

export type ConfigState = {
  defaultShellPath: string;
  availableShells: string[];
  status: 'success' | 'error' | 'loading';
  hostConfigs: HostConfig[];
};

const initialState: ConfigState = {
  defaultShellPath: '',
  availableShells: [],
  status: 'success',
  hostConfigs: []
};

const configSlice = createAppSlice({
  name: 'config',
  initialState,
  reducers: {
    updatePreferredShellPath: (state, action: PayloadAction<string>) => {
      state.defaultShellPath = action.payload;
    },
    updateAvailableShells: (state, action: PayloadAction<string[]>) => {
      state.availableShells = action.payload;
    }
  },
  selectors: {
    selectPreferredShellPath: state => state.defaultShellPath,
    selectAvailableShells: state => state.availableShells,
    selectHostConfigs: state => state.hostConfigs
  }
});

export const { updatePreferredShellPath, updateAvailableShells } = configSlice.actions;

export const { selectAvailableShells, selectPreferredShellPath, selectHostConfigs } =
  configSlice.selectors;

export function fetchAvailableShells(): AppThunk {
  return async dispatch => {
    const shells = await window.terminal.getAvailableShells();
    console.log('Available shells:', shells);
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
