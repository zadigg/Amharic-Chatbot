import React from 'react';
import { Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface SettingsPanelProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  theme: 'light' | 'dark';
}

export function SettingsPanel({ 
  showSettings, 
  setShowSettings,
  theme 
}: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings();

  return (
    <div 
      role="complementary"
      aria-label="Settings Panel"
      className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`w-full p-4 flex items-center justify-between ${
          theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2">
          {showSettings ? (
            <ArrowLeft className="w-5 h-5 md:hidden" />
          ) : (
            <SettingsIcon className="w-5 h-5" />
          )}
          <span style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}>
            {showSettings ? 'ተመለስ' : 'ቅንብሮች'}
          </span>
        </div>
        <span className={`transform transition-transform hidden md:inline-block ${showSettings ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {showSettings && (
        <div 
          className={`p-4 space-y-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
          data-testid="settings-content"
        >
          <div className="space-y-2">
            <label 
              htmlFor="theme-select"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
            >
              ጭብጥ
            </label>
            <select
              id="theme-select"
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="light">ብርሃን</option>
              <option value="dark">ጨለማ</option>
            </select>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="font-size-select"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
            >
              የፊደል መጠን
            </label>
            <select
              id="font-size-select"
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="small">ትንሽ</option>
              <option value="medium">መካከለኛ</option>
              <option value="large">ትልቅ</option>
            </select>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="language-select"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
            >
              ቋንቋ
            </label>
            <select
              id="language-select"
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as 'am' | 'en' })}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="am">አማርኛ</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}