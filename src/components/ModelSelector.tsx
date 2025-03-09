import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { availableModels } from '../services/models';
import { Settings } from '../types';

interface ModelSelectorProps {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  theme: 'light' | 'dark';
}

const getModelIcon = (modelId: string) => {
  if (modelId.startsWith('gpt')) return <Sparkles className="w-4 h-4" />;
  if (modelId.startsWith('gemini')) return <Zap className="w-4 h-4" />;
  return <Sparkles className="w-4 h-4" />;
};

export function ModelSelector({ settings, updateSettings, theme }: ModelSelectorProps) {
  return (
    <div className="relative">
      <div className={`relative inline-block w-full ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-gray-100 border-gray-200'
      } border rounded-md`}>
        <select
          value={settings.model}
          onChange={(e) => updateSettings({ model: e.target.value })}
          className={`appearance-none w-full py-2 pl-3 pr-10 text-sm ${
            theme === 'dark' 
              ? 'bg-gray-800 text-gray-300' 
              : 'bg-gray-100 text-gray-900'
          } focus:outline-none cursor-pointer`}
          style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
        >
          {availableModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {getModelIcon(settings.model)}
        </div>
      </div>
      <div className={`mt-1 text-xs ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {availableModels.find(m => m.id === settings.model)?.description}
      </div>
    </div>
  );
}