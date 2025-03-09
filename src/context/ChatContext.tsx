import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Message } from '../types';

type ChatSession = {
  id: string;
  messages: Message[];
  createdAt: Date;
};

type ChatState = {
  sessions: ChatSession[];
  currentSessionId: string;
  messages: Message[];
  isLoading: boolean;
  input: string;
};

type ChatAction =
  | { type: 'SET_SESSIONS'; payload: ChatSession[] }
  | { type: 'SET_CURRENT_SESSION'; payload: string }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'CREATE_SESSION' }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message };

const initialState: ChatState = {
  sessions: [],
  currentSessionId: '',
  messages: [],
  isLoading: false,
  input: '',
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSessionId: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'CREATE_SESSION': {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        messages: [],
        createdAt: new Date(),
      };
      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        currentSessionId: newSession.id,
        messages: [],
      };
    }
    case 'DELETE_SESSION': {
      const newSessions = state.sessions.filter(s => s.id !== action.payload);
      const newCurrentId = state.currentSessionId === action.payload
        ? newSessions[0]?.id || ''
        : state.currentSessionId;
      return {
        ...state,
        sessions: newSessions,
        currentSessionId: newCurrentId,
        messages: newCurrentId ? state.messages : [],
      };
    }
    case 'ADD_MESSAGE': {
      const newMessages = [...state.messages, action.payload];
      const newSessions = state.sessions.map(session =>
        session.id === state.currentSessionId
          ? { ...session, messages: newMessages }
          : session
      );
      return {
        ...state,
        messages: newMessages,
        sessions: newSessions,
      };
    }
    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
      }));
      dispatch({ type: 'SET_SESSIONS', payload: parsedSessions });
      if (parsedSessions.length > 0) {
        const mostRecent = parsedSessions[0];
        dispatch({ type: 'SET_CURRENT_SESSION', payload: mostRecent.id });
        dispatch({ type: 'SET_MESSAGES', payload: mostRecent.messages });
      }
    } else {
      dispatch({ type: 'CREATE_SESSION' });
    }
  }, []);

  useEffect(() => {
    if (state.sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(state.sessions));
    }
  }, [state.sessions]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext }