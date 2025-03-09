import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ChatPage } from '../../components/ChatPage';
import chatReducer from '../../store/slices/chatSlice';
import settingsReducer from '../../store/slices/settingsSlice';
import { generateResponse } from '../../services/chat';
import { AppText } from '../../constants/text';

// Mock the chat service
vi.mock('../../services/chat', () => ({
  generateResponse: vi.fn()
}));

// Mock scrollIntoView
const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe('ChatPage', () => {
  const mockMessages = [
    { role: 'user', content: 'ሰላም', modelId: 'gpt-4o-mini' },
    { role: 'assistant', content: 'ሰላም! እንደምን አሉ?', modelId: 'gpt-4o-mini' }
  ];

  const defaultProps = {
    messages: mockMessages,
    theme: 'light' as const,
    fontSize: 'medium' as const,
    isLoading: false
  };

  const renderWithRedux = (component: React.ReactElement) => {
    const store = configureStore({
      reducer: {
        chat: chatReducer,
        settings: settingsReducer
      },
      preloadedState: {
        chat: {
          sessions: [],
          currentSessionId: '',
          messages: mockMessages,
          isLoading: false,
          input: ''
        },
        settings: {
          theme: 'light',
          fontSize: 'medium',
          language: 'am',
          model: 'gpt-4o-mini'
        }
      }
    });
    return {
      store,
      ...render(
        <Provider store={store}>
          {component}
        </Provider>
      )
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders welcome message when no messages exist', () => {
      renderWithRedux(<ChatPage {...defaultProps} messages={[]} />);
      expect(screen.getByText('እንኳን ደህና መጡ! ጥያቄዎን በአማርኛ ይጻፉ።')).toBeInTheDocument();
    });

    it('renders chat messages when they exist', () => {
      renderWithRedux(<ChatPage {...defaultProps} />);
      expect(screen.getByText('ሰላም')).toBeInTheDocument();
      expect(screen.getByText('ሰላም! እንደምን አሉ?')).toBeInTheDocument();
    });
  });

  describe('Chat Input', () => {
    it('renders chat input with correct placeholder', () => {
      renderWithRedux(<ChatPage {...defaultProps} />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      expect(input).toBeInTheDocument();
    });

    it('disables input when loading', () => {
      renderWithRedux(<ChatPage {...defaultProps} isLoading={true} />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      expect(input).toBeDisabled();
    });
  });

  describe('Model Selection', () => {
    it('renders available models in selector', () => {
      renderWithRedux(<ChatPage {...defaultProps} />);
      const modelSelector = screen.getByRole('combobox');
      expect(modelSelector).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('GPT-4 Mini');
      expect(options[1]).toHaveTextContent('Gemini 2.0 Flash');
    });

    it('allows model selection change', () => {
      const { store } = renderWithRedux(<ChatPage {...defaultProps} />);
      const modelSelector = screen.getByRole('combobox');

      fireEvent.change(modelSelector, { target: { value: 'gemini-2.0-flash-lite-preview-02-05' } });
      expect(store.getState().settings.model).toBe('gemini-2.0-flash-lite-preview-02-05');
    });
  });

  describe('Message Interaction', () => {
    beforeEach(() => {
      (generateResponse as jest.Mock).mockResolvedValue('ሰላም! እንደምን አሉ?');
    });

    it('sends message and displays response', async () => {
      renderWithRedux(<ChatPage {...defaultProps} />);

      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      const form = screen.getByRole('form', { name: 'chat-form' });

      fireEvent.change(input, { target: { value: 'ሰላም' } });
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('ሰላም')).toBeInTheDocument();
      });
    });

    it('shows loading indicator while waiting for response', () => {
      renderWithRedux(<ChatPage {...defaultProps} isLoading={true} />);
      const loadingIndicator = screen.getByTestId('loading-indicator');
      expect(loadingIndicator).toBeInTheDocument();
      expect(loadingIndicator).toHaveTextContent('እባክዎ ይጠብቁ...');
    });

    it('handles API errors gracefully', async () => {
      const { store } = renderWithRedux(<ChatPage {...defaultProps} messages={[]} />);

      // Mock the API error
      (generateResponse as jest.Mock).mockImplementation(async (message, modelId, previousMessages, handlers) => {
        if (handlers) {
          handlers.onStart?.();
          handlers.onError?.(new Error('API Error'));
          handlers.onComplete?.();
        }
        throw new Error('API Error');
      });

      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      const form = screen.getByRole('form', { name: 'chat-form' });

      // Submit the form
      fireEvent.change(input, { target: { value: 'ሰላም' } });
      fireEvent.submit(form);

      // Wait for the error message to appear in the store
      await waitFor(() => {
        const messages = store.getState().chat.messages;
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage?.content).toBe(AppText.Common.ERROR);
      });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});