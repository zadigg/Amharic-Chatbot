import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setTheme,
  setFontSize,
  setLanguage,
  setModel,
} from '../store/slices/settingsSlice';
import { Settings } from '../types';

export function useSettings() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const updateSettings = useCallback(
    (newSettings: Partial<Settings>) => {
      Object.entries(newSettings).forEach(([key, value]) => {
        switch (key) {
          case 'theme':
            dispatch(setTheme(value as 'light' | 'dark'));
            break;
          case 'fontSize':
            dispatch(setFontSize(value as 'small' | 'medium' | 'large'));
            break;
          case 'language':
            dispatch(setLanguage(value as 'am' | 'en'));
            break;
          case 'model':
            dispatch(setModel(value as string));
            break;
        }
      });
    },
    [dispatch]
  );

  return {
    settings,
    updateSettings,
  };
}