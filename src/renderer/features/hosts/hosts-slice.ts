import { createAppSlice } from '@/app/createAppSlice';
import { AppThunk } from '@/app/store';
import { HostConfig } from '@dts/host-config';
import { PayloadAction } from '@reduxjs/toolkit';

export interface HostsState {
  hosts: HostConfig[];
  fetching: boolean;
}

const initialState: HostsState = {
  hosts: [],
  fetching: true
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
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    }
  },
  selectors: {
    selectHosts: state => state.hosts,
    selectHostsFetching: state => state.fetching
  }
});

export function getHosts(): AppThunk {
  return async dispatch => {
    dispatch(setFetching(true));
    const hostsResponse = await window.hosts.getAll();
    if (hostsResponse.success === true) {
      dispatch(setHosts(hostsResponse.data));
    } else {
      console.error('Failed to fetch host configs:', hostsResponse.error);
    }
    dispatch(setFetching(false));
  };
}

export function addHostConfig(host: Omit<HostConfig, 'id'>): AppThunk {
  return async dispatch => {
    const newHostResponse = await window.hosts.add(host);
    if (newHostResponse.success === true) {
      dispatch(addHost(newHostResponse.data));
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

const { setHosts, addHost, removeHost, setFetching } = hostsSlice.actions;
export const { selectHosts, selectHostsFetching } = hostsSlice.selectors;
export default hostsSlice.reducer;
