import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getModelById } from '../services/models';
import { ModelSelector } from './ModelSelector';
import { useSettings } from '../hooks/useSettings';
import { AppText } from '../constants/text';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  currentModel: string;
  theme: 'light' | 'dark';
}

export function ChatInput({ 
  input, 
  setInput, 
  isLoading, 
  onSubmit,
  currentModel,
  theme
}: ChatInputProps) {
  const { settings, updateSettings } = useSettings();
  const model = getModelById(currentModel);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit(e);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-4 p-4"
        aria-label="chat-form"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={AppText.Chat.INPUT_PLACEHOLDER}
          className={`w-full px-0 py-2 bg-transparent border-b-2 outline-none transition-colors ${
            theme === 'dark'
              ? 'text-gray-100 placeholder-gray-400 border-gray-700 focus:border-gray-500'
              : 'text-gray-900 placeholder-gray-500 border-gray-200 focus:border-gray-400'
          }`}
          style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
          disabled={isLoading}
          data-testid="chat-input"
        />
        
        <div className="flex items-center justify-between">
          <ModelSelector 
            settings={settings}
            updateSettings={updateSettings}
            theme={theme}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className={`p-2 ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-gray-100'
                : 'text-gray-600 hover:text-gray-900'
            } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}