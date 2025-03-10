import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { AppText } from '../constants/text';
import { useChat } from '../hooks/useChat';
import { useSettings } from '../hooks/useSettings';

interface ChatPageProps {
  messages: Message[];
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  isLoading: boolean;
}

export function ChatPage({ messages, theme, fontSize, isLoading }: ChatPageProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = useChat();
  const { settings } = useSettings();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const renderThinkingIndicator = () => {
    if (!isLoading) return null;

    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg max-w-fit">
        <div className="flex space-x-1.5">
          <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce [animation-delay:-0.3s]`} />
          <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce [animation-delay:-0.15s]`} />
          <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`} />
        </div>
        <span 
          className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
          style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
        >
          {AppText.Common.LOADING}
        </span>
      </div>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <h1 
          className={`text-4xl font-bold mb-8 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}
          style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
        >
          {AppText.Chat.WELCOME_MESSAGE}
        </h1>
        <div className="w-full max-w-2xl">
          <ChatInput 
            input={chat.input}
            setInput={chat.setInput}
            isLoading={isLoading}
            onSubmit={chat.handleSubmit}
            currentModel={settings.model}
            theme={theme}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 overflow-y-auto
        ${theme === 'dark' 
          ? 'scrollbar-dark' 
          : 'scrollbar-light'
        }
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300/50
        dark:[&::-webkit-scrollbar-thumb]:bg-gray-500/50
        hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500
        [&::-webkit-scrollbar-thumb]:transition-colors
        [&::-webkit-scrollbar-thumb]:duration-200
      `}>
        <div className="container mx-auto max-w-4xl p-4">
          <div className="space-y-4 mb-4">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message} 
                theme={theme}
                fontSize={fontSize}
                isLoading={isLoading}
                isLastMessage={index === messages.length - 1}
              />
            ))}
            {renderThinkingIndicator()}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto max-w-4xl">
          <ChatInput 
            input={chat.input}
            setInput={chat.setInput}
            isLoading={isLoading}
            onSubmit={chat.handleSubmit}
            currentModel={settings.model}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}