import { createAppSlice } from '@/app/createAppSlice';
import { AppThunk } from '@/app/store';
import { HostConfig } from '@dts/host-config';
import { PayloadAction } from '@reduxjs/toolkit';

export interface HostsState {
  hosts: HostConfig[];
}

const initialState: HostsState = {
  hosts: []
};

const hostsSlice = createAppSlice({
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
    const hostsResponse = await window.hosts.getAll();
    if (hostsResponse.success === true) {
      dispatch(setHosts(hostsResponse.data));
    } else {
      console.error('Failed to fetch host configs:', hostsResponse.error);
    }
  };
}

export function addHostConfig(host: HostConfig): AppThunk {
  return async dispatch => {
    const newHostResponse = await window.hosts.add(host);
    if (newHostResponse.success === true) {
      dispatch(addHost(host));
    } else {
      console.error('Failed to add host config:', newHostResponse.error);
    }
  };
}

export function removeHostConfig(hostId: string): AppThunk {
  return async dispatch => {
    const removeResponse = await window.hosts.remove(hostId);
    if (removeResponse.success === true) {
      dispatch(removeHost(hostId));
    } else {
      console.error('Failed to remove host config:', removeResponse.error);
    }
  };
}

const { setHosts, addHost, removeHost } = hostsSlice.actions;
export const { selectHosts } = hostsSlice.selectors;
export default hostsSlice.reducer;
