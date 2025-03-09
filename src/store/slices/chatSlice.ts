import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../../types';
import { generateResponse } from '../../services/chat';
import { AppDispatch } from '../index';
import { setModel } from './settingsSlice';
import { AppText } from '../../constants/text';

export type ChatSession = {
  id: string;
  messages: Message[];
  createdAt: string;
  modelId: string;
};

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string;
  messages: Message[];
  isLoading: boolean;
  input: string;
}

const initialState: ChatState = {
  sessions: [],
  currentSessionId: '',
  messages: [],
  isLoading: false,
  input: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setInitialSessions: (state, action: PayloadAction<ChatSession[]>) => {
      state.sessions = action.payload;
      if (action.payload.length > 0) {
        const mostRecent = action.payload[0];
        state.currentSessionId = mostRecent.id;
        state.messages = mostRecent.messages;
      }
    },
    createSession: (state, action: PayloadAction<string>) => {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        messages: [],
        createdAt: new Date().toISOString(),
        modelId: action.payload,
      };
      state.sessions.unshift(newSession);
      state.currentSessionId = newSession.id;
      state.messages = [];
    },
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
      if (state.currentSessionId === action.payload) {
        if (state.sessions.length > 0) {
          state.currentSessionId = state.sessions[0].id;
          state.messages = state.sessions[0].messages;
        } else {
          state.currentSessionId = '';
          state.messages = [];
        }
      }
    },
    loadSession: (state, action: PayloadAction<string>) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        state.currentSessionId = action.payload;
        state.messages = session.messages;
      }
    },
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      
      if (!state.currentSessionId) {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          messages: [action.payload],
          createdAt: new Date().toISOString(),
          modelId: action.payload.modelId || '',
        };
        state.sessions.unshift(newSession);
        state.currentSessionId = newSession.id;
      } else {
        const sessionIndex = state.sessions.findIndex(s => s.id === state.currentSessionId);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex].messages = state.messages;
        }
      }
    },
    updateLastMessage: (state, action: PayloadAction<{ content: string }>) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1];
        lastMessage.content = action.payload.content;
        lastMessage.isStreaming = false;

        const sessionIndex = state.sessions.findIndex(s => s.id === state.currentSessionId);
        if (sessionIndex !== -1) {
          state.sessions[sessionIndex].messages = state.messages;
        }
      }
    },
    updateSessionModel: (state, action: PayloadAction<{ sessionId: string; modelId: string }>) => {
      const session = state.sessions.find(s => s.id === action.payload.sessionId);
      if (session) {
        session.modelId = action.payload.modelId;
      }
    },
  },
});

export const {
  setInitialSessions,
  createSession,
  deleteSession,
  loadSession,
  setInput,
  setLoading,
  addMessage,
  updateLastMessage,
  updateSessionModel,
} = chatSlice.actions;

export const submitMessage = (input: string, modelId: string) => async (dispatch: AppDispatch, getState: () => any) => {
  if (!input.trim()) return;

  const state = getState();
  const currentMessages = state.chat.messages;

  const userMessage: Message = { 
    role: 'user', 
    content: input,
    modelId
  };
  dispatch(addMessage(userMessage));
  dispatch(setInput(''));
  dispatch(setLoading(true));

  const botMessage: Message = {
    role: 'assistant',
    content: '',
    modelId,
    isStreaming: true
  };
  dispatch(addMessage(botMessage));

  try {
    await generateResponse(input, modelId, currentMessages, {
      onStart: () => {
        dispatch(setLoading(true));
      },
      onToken: (token: string) => {
        dispatch(updateLastMessage({ content: token }));
      },
      onComplete: () => {
        dispatch(setLoading(false));
      },
      onError: (error) => {
        console.error('Error in streaming response:', error);
        dispatch(setLoading(false));
        dispatch(updateLastMessage({ content: AppText.Common.ERROR }));
      }
    });
  } catch (error) {
    console.error('Error generating response:', error);
    dispatch(setLoading(false));
    dispatch(updateLastMessage({ content: AppText.Common.ERROR }));
  }
};

export default chatSlice.reducer;