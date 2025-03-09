import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  createSession,
  deleteSession,
  loadSession,
  setInput,
  submitMessage,
  updateSessionModel,
} from '../store/slices/chatSlice';
import { setModel } from '../store/slices/settingsSlice';

export function useChat() {
  const dispatch = useDispatch<AppDispatch>();
  const chat = useSelector((state: RootState) => state.chat);
  const settings = useSelector((state: RootState) => state.settings);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!chat.input.trim() || chat.isLoading) return;
      
      // Update the current session's model if it exists
      if (chat.currentSessionId) {
        dispatch(updateSessionModel({ 
          sessionId: chat.currentSessionId, 
          modelId: settings.model 
        }));
      }
      
      dispatch(submitMessage(chat.input, settings.model));
    },
    [dispatch, chat.input, chat.isLoading, chat.currentSessionId, settings.model]
  );

  const createNewSession = useCallback(() => {
    dispatch(createSession(settings.model));
  }, [dispatch, settings.model]);

  const loadChatSession = useCallback((id: string) => {
    dispatch(loadSession(id));
    const session = chat.sessions.find(s => s.id === id);
    if (session?.modelId) {
      dispatch(setModel(session.modelId));
    }
  }, [dispatch, chat.sessions]);

  return {
    ...chat,
    createNewSession,
    loadSession: loadChatSession,
    deleteSession: (id: string) => dispatch(deleteSession(id)),
    setInput: (input: string) => dispatch(setInput(input)),
    handleSubmit,
  };
}