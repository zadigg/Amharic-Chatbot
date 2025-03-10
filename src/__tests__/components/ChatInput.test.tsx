import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ChatInput } from '../../components/ChatInput';
import settingsReducer from '../../store/slices/settingsSlice';

describe('ChatInput', () => {
  const mockProps = {
    input: '',
    setInput: vi.fn(),
    isLoading: false,
    onSubmit: vi.fn(),
    currentModel: 'gpt-4o-mini',
    theme: 'light' as const
  };

  const renderWithRedux = (component: React.ReactElement) => {
    const store = configureStore({
      reducer: {
        settings: settingsReducer
      },
      preloadedState: {
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

  describe('Input Field', () => {
    it('renders input field with correct placeholder', () => {
      renderWithRedux(<ChatInput {...mockProps} />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      expect(input).toBeInTheDocument();
    });

    it('updates input value on change', () => {
      renderWithRedux(<ChatInput {...mockProps} />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      
      fireEvent.change(input, { target: { value: 'ሰላም' } });
      expect(mockProps.setInput).toHaveBeenCalledWith('ሰላም');
    });

    it('disables input when loading', () => {
      renderWithRedux(<ChatInput {...mockProps} isLoading={true} />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      expect(input).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit when form is submitted with valid input', () => {
      renderWithRedux(<ChatInput {...mockProps} input="ሰላም" />);
      const form = screen.getByRole('form', { name: 'chat-form' });
      
      fireEvent.submit(form);
      expect(mockProps.onSubmit).toHaveBeenCalled();
    });

    it('prevents submission when loading', () => {
      renderWithRedux(<ChatInput {...mockProps} input="ሰላም" isLoading={true} />);
      const form = screen.getByRole('form', { name: 'chat-form' });
      const submitButton = screen.getByRole('button', { type: 'submit' });
      
      expect(submitButton).toBeDisabled();
      fireEvent.submit(form);
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Model Selection', () => {
    it('renders model selector with available models', () => {
      renderWithRedux(<ChatInput {...mockProps} />);
      const modelSelector = screen.getByRole('combobox');
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveTextContent('GPT-4 Mini');
      expect(options[1]).toHaveTextContent('Gemini 2.0 Flash');
    });

    it('shows model description', () => {
      renderWithRedux(<ChatInput {...mockProps} />);
      expect(screen.getByText('OpenAI GPT-4 Mini model')).toBeInTheDocument();
    });
  });

  describe('Theme Support', () => {
    it('applies correct theme classes in light mode', () => {
      renderWithRedux(<ChatInput {...mockProps} theme="light" />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      expect(input).toHaveClass('text-gray-900');
    });

    it('applies correct theme classes in dark mode', () => {
      renderWithRedux(<ChatInput {...mockProps} theme="dark" />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      expect(input).toHaveClass('text-gray-100');
    });
  });

  describe('Accessibility', () => {
    it('maintains focus after submission', () => {
      renderWithRedux(<ChatInput {...mockProps} />);
      const input = screen.getByPlaceholderText('በአማርኛ ይጻፉ...');
      const form = screen.getByRole('form', { name: 'chat-form' });
      
      input.focus();
      fireEvent.submit(form);
      
      expect(document.activeElement).toBe(input);
    });

    it('has accessible submit button', () => {
      renderWithRedux(<ChatInput {...mockProps} />);
      const submitButton = screen.getByRole('button', { type: 'submit' });
      expect(submitButton).toBeInTheDocument();
    });
  });
});