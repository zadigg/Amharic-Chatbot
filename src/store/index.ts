import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;