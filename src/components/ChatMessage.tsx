import React from 'react';
import { Sparkles, Zap, User, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { getModelById } from '../services/models';
import { CopyButton } from './CopyButton';
import { MessageContent } from './MessageContent';
import { AppText } from '../constants/text';

interface ChatMessageProps {
  message: Message;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  isLastMessage?: boolean;
}

const getModelIcon = (modelId: string | undefined) => {
  if (!modelId) return <User className="w-6 h-6 text-white" />;
  if (modelId.startsWith('gpt')) return <Sparkles className="w-6 h-6 text-white" />;
  if (modelId.startsWith('gemini')) return <Zap className="w-6 h-6 text-white" />;
  return <User className="w-6 h-6 text-white" />;
};

export function ChatMessage({ message, theme, fontSize, isLoading, isLastMessage }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const model = message.modelId ? getModelById(message.modelId) : null;
  const isStreaming = message.isStreaming && isLastMessage;

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className={`p-2 rounded-full ${
          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'
        } ${(isLoading || isStreaming) && isLastMessage ? 'animate-pulse' : ''}`}>
          {(isLoading || isStreaming) && isLastMessage ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            getModelIcon(message.modelId)
          )}
        </div>
      )}
      <div className={`max-w-[80%] relative group ${
        isUser 
          ? theme === 'dark'
            ? 'bg-gray-700 rounded-lg px-4 py-3'
            : 'bg-gray-100 rounded-lg px-4 py-3'
          : ''
      }`}>
        <div className="flex flex-col gap-1">
          {!isUser && model && (
            <div className="flex items-center justify-between">
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } flex items-center gap-2`}>
                {model.name}
                {(isLoading || isStreaming) && isLastMessage && (
                  <span className="text-xs" data-testid="loading-indicator">
                    {AppText.Common.LOADING}
                  </span>
                )}
              </span>
              {!isLoading && !isStreaming && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton content={message.content} theme={theme} />
                </div>
              )}
            </div>
          )}
          <div 
            className={`${getFontSize()} ${
              theme === 'dark'
                ? isUser ? 'text-gray-100' : 'text-gray-300'
                : isUser ? 'text-gray-900' : 'text-gray-700'
            }`}
            style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
          >
            <MessageContent content={message.content} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}