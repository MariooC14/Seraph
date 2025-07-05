import { AppThunk } from '@/app/store';
import { HostConfig } from '@dts/host-config';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HostsState {
  hosts: HostConfig[];
}

const initialState: HostsState = {
  hosts: []
};

const hostsSlice = createSlice({
  name: 'hosts',
  initialState,
  reducers: {
    setHosts(state, action: PayloadAction<HostConfig[]>) {
      state.hosts = action.payload;
    },
    clearHosts(state) {
      state.hosts = [];
    },
    addHost(state, action: PayloadAction<HostConfig>) {
      state.hosts.push(action.payload);
    },
    removeHost(state, action: PayloadAction<string>) {
      state.hosts = state.hosts.filter(host => host.id !== action.payload);
    }
  },
  selectors: {
    selectHosts: state => state.hosts
  }
});

export function getHostConfigs(): AppThunk {
  return async dispatch => {
    await window.hosts.getAll().then(res => {
      if (res.success === true) {
        dispatch(setHosts(res.data));
      } else {
        console.error('Failed to fetch host configs:', res.error);
      }
    });
  };
}

export function addHostConfig(host: HostConfig): AppThunk {
  return async dispatch => {
    await window.hosts.add(host).then(res => {
      if (res.success === true) {
        dispatch(addHost(host));
      } else {
        console.error('Failed to add host config:', res.error);
      }
    });
  };
}

export function removeHostConfig(hostId: string): AppThunk {
  return async dispatch => {
    await window.hosts.remove(hostId).then(res => {
      if (res.success === true) {
        dispatch(removeHost(hostId));
      } else {
        console.error('Failed to remove host config:', res.error);
      }
    });
  };
}

const { setHosts, addHost, removeHost } = hostsSlice.actions;
export const { selectHosts } = hostsSlice.selectors;
export default hostsSlice.reducer;
