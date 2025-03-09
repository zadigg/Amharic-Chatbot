import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatPage } from './components/ChatPage';
import { useChat } from './hooks/useChat';
import { useSettings } from './hooks/useSettings';
import { setInitialSessions } from './store/slices/chatSlice';
import { setAllSettings } from './store/slices/settingsSlice';

function App() {
  const dispatch = useDispatch();
  const { settings } = useSettings();
  const chat = useChat();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedSettings = localStorage.getItem('chatSettings');
    
    if (savedSettings) {
      dispatch(setAllSettings(JSON.parse(savedSettings)));
    }
    
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      dispatch(setInitialSessions(parsedSessions));
    }
  }, [dispatch]);

  useEffect(() => {
    if (chat.sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chat.sessions));
    }
  }, [chat.sessions]);

  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <div className={`flex h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`fixed md:relative md:flex z-40 ${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300`}>
        <Sidebar 
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          sessions={chat.sessions}
          currentSessionId={chat.currentSessionId}
          createNewSession={chat.createNewSession}
          loadSession={chat.loadSession}
          deleteSession={chat.deleteSession}
          theme={settings.theme}
        />

        {showSidebar && isMobile && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          theme={settings.theme}
        />

        <div className="flex-1 overflow-hidden relative">
          <ChatPage 
            messages={chat.messages}
            theme={settings.theme}
            fontSize={settings.fontSize}
            isLoading={chat.isLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default App