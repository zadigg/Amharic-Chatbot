import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Settings } from '../types';
import { availableModels } from '../services/models';

type SettingsAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_FONT_SIZE'; payload: 'small' | 'medium' | 'large' }
  | { type: 'SET_LANGUAGE'; payload: 'am' | 'en' }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'SET_ALL_SETTINGS'; payload: Settings };

const initialSettings: Settings = {
  theme: 'light',
  fontSize: 'medium',
  language: 'am',
  model: availableModels[0].id,
};

function settingsReducer(state: Settings, action: SettingsAction): Settings {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_MODEL':
      return { ...state, model: action.payload };
    case 'SET_ALL_SETTINGS':
      return action.payload;
    default:
      return state;
  }
}

const SettingsContext = createContext<{
  settings: Settings;
  dispatch: React.Dispatch<SettingsAction>;
} | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      dispatch({ type: 'SET_ALL_SETTINGS', payload: JSON.parse(savedSettings) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsContext }