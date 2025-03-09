import React from 'react';
import { Bot, Trash2, PanelLeftClose, Plus, User, Github } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { SettingsPanel } from './SettingsPanel';
import { ChatSession } from '../store/slices/chatSlice';

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  sessions: ChatSession[];
  currentSessionId: string;
  createNewSession: () => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  theme: 'light' | 'dark';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return 'ዛሬ';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'ትላንት';
  }
  return 'ሌላ ቀን';
}

function groupSessionsByDate(sessions: ChatSession[]): { [key: string]: ChatSession[] } {
  return sessions.reduce((groups: { [key: string]: ChatSession[] }, session) => {
    const dateGroup = formatDate(session.createdAt);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(session);
    return groups;
  }, {});
}

export function Sidebar({
  showSidebar,
  setShowSidebar,
  showSettings,
  setShowSettings,
  sessions,
  currentSessionId,
  createNewSession,
  loadSession,
  deleteSession,
  theme
}: SidebarProps) {
  const groupedSessions = groupSessionsByDate(sessions);
  const dateGroups = ['ዛሬ', 'ትላንት', 'ሌላ ቀን'];

  return (
    <aside className={`fixed md:relative h-screen w-80 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg transform ${
      showSidebar ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-300 ease-in-out flex flex-col z-50`}>
      <div className={`p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'
      } text-white flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}>
            የውይይት ታሪክ
          </h2>
        </div>
        <button
          onClick={() => {
            setShowSidebar(false);
            setShowSettings(false);
          }}
          className="p-2 hover:bg-gray-700 rounded-full md:hidden"
        >
          <PanelLeftClose className="w-6 h-6" />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto ${showSettings ? 'hidden md:block' : 'block'}`}>
        <div className="p-4">
          <button
            onClick={createNewSession}
            className={`w-full p-3 mb-6 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            } flex items-center justify-center gap-2 transition-colors duration-200`}
            style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}
          >
            <Plus className="w-5 h-5" />
            አዲስ ውይይት ጀምር
          </button>

          <div className="space-y-6">
            {dateGroups.map(group => {
              const groupSessions = groupedSessions[group] || [];
              if (groupSessions.length === 0) return null;

              return (
                <div key={group}>
                  <h3 className={`text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}>
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {groupSessions.map(session => (
                      <div
                        key={session.id}
                        onClick={() => loadSession(session.id)}
                        className={`group flex items-center justify-between py-2 px-3 cursor-pointer ${
                          currentSessionId === session.id 
                            ? theme === 'dark'
                              ? 'bg-gray-700 text-gray-100'
                              : 'bg-gray-100 text-gray-900'
                            : theme === 'dark'
                              ? 'text-gray-300 hover:bg-gray-700/50'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-sm truncate flex-1" 
                           style={{ fontFamily: 'Noto Sans Ethiopic, sans-serif' }}>
                          {session.messages[0]?.content || 'አዲስ ውይይት'}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200 ${
                            theme === 'dark'
                              ? 'hover:bg-gray-600 text-gray-400'
                              : 'hover:bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${showSettings ? 'block' : 'block md:block'}`}>
        <SettingsPanel 
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          theme={theme}
        />
        
        {/* User Profile Section */}
        <div className={`p-4 border-t ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className={`flex items-center gap-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div className="p-2 rounded-full bg-gray-700">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Abel Negash</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm opacity-75">Developer</p>
                <a
                  href="https://github.com/zadigg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1 rounded-md transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                      : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}