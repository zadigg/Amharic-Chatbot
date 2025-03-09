import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings } from '../../types';
import { availableModels } from '../../services/models';

const initialState: Settings = {
  theme: 'light',
  fontSize: 'medium',
  language: 'am',
  model: 'gpt-4o-mini', // Set OpenAI as default model
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'am' | 'en'>) => {
      state.language = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    setAllSettings: (state, action: PayloadAction<Settings>) => {
      return action.payload;
    },
  },
});

export const {
  setTheme,
  setFontSize,
  setLanguage,
  setModel,
  setAllSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;