import terminalTabsReducer from '@/features/terminalTabs/terminalTabsSlice';
import configReducer from '@/features/config/configSlice';
import hostsReducer from '@/features/hosts/hosts-slice';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    terminalTabs: terminalTabsReducer,
    config: configReducer,
    hosts: hostsReducer
  }
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
