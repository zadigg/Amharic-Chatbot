import React from 'react';
import { PanelLeft } from 'lucide-react';
import { AppText } from '../constants/text';

interface HeaderProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  theme: 'light' | 'dark';
}

export function Header({ 
  showSidebar, 
  setShowSidebar,
  theme 
}: HeaderProps) {
  return (
    <header className={`${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } shadow-sm border-b p-4 flex items-center gap-4`}>
      <button
        onClick={() => setShowSidebar(true)}
        className={`p-2 ${
          theme === 'dark' 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-800'
        } rounded-full ${!showSidebar ? 'visible' : 'invisible md:hidden'}`}
        title={AppText.Header.TOGGLE_SIDEBAR}
      >
        <PanelLeft className="w-6 h-6" />
      </button>

      <h1 className={`text-2xl font-bold text-center flex-1 ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`} style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}>
        {AppText.Header.TITLE}
      </h1>

      <div className="w-10"></div>
    </header>
  );
}