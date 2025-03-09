import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Sidebar } from '../../components/Sidebar';
import settingsReducer from '../../store/slices/settingsSlice';
import { AppText } from '../../constants/text';

describe('Sidebar', () => {
  const mockProps = {
    showSidebar: true,
    setShowSidebar: vi.fn(),
    showSettings: false,
    setShowSettings: vi.fn(),
    sessions: [],
    currentSessionId: '',
    createNewSession: vi.fn(),
    loadSession: vi.fn(),
    deleteSession: vi.fn(),
    theme: 'light' as const
  };

  const renderWithRedux = (component: React.ReactElement) => {
    const store = configureStore({
      reducer: {
        settings: settingsReducer
      }
    });
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('New Chat Button', () => {
    it('renders new chat button', () => {
      renderWithRedux(<Sidebar {...mockProps} />);
      const newChatButton = screen.getByText('አዲስ ውይይት ጀምር');
      expect(newChatButton).toBeInTheDocument();
    });

    it('calls createNewSession when new chat button is clicked', () => {
      renderWithRedux(<Sidebar {...mockProps} />);
      const newChatButton = screen.getByText('አዲስ ውይይት ጀምር');
      fireEvent.click(newChatButton);
      expect(mockProps.createNewSession).toHaveBeenCalled();
    });
  });

  describe('Settings Panel', () => {
    it('renders settings button', () => {
      renderWithRedux(<Sidebar {...mockProps} />);
      const settingsButton = screen.getByText('ቅንብሮች');
      expect(settingsButton).toBeInTheDocument();
    });

    it('toggles settings panel when settings button is clicked', () => {
      renderWithRedux(<Sidebar {...mockProps} />);
      const settingsButton = screen.getByText('ቅንብሮች');
      fireEvent.click(settingsButton);
      expect(mockProps.setShowSettings).toHaveBeenCalledWith(true);
    });

    it('shows settings options when settings panel is open', () => {
      renderWithRedux(<Sidebar {...mockProps} showSettings={true} />);
      
      // Check theme selector
      expect(screen.getByText('ጭብጥ')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ብርሃን' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ጨለማ' })).toBeInTheDocument();

      // Check font size selector
      expect(screen.getByText('የፊደል መጠን')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ትንሽ' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'መካከለኛ' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'ትልቅ' })).toBeInTheDocument();

      // Check language selector
      expect(screen.getByText('ቋንቋ')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'አማርኛ' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    });
  });

  describe('Chat Sessions', () => {
    const mockSessions = [
      {
        id: '1',
        messages: [{ role: 'user', content: 'ሰላም', modelId: 'gpt-4o-mini' }],
        createdAt: new Date().toISOString(),
        modelId: 'gpt-4o-mini'
      },
      {
        id: '2',
        messages: [{ role: 'user', content: 'እንደምን አሉ', modelId: 'gpt-4o-mini' }],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        modelId: 'gpt-4o-mini'
      }
    ];

    it('renders chat sessions grouped by date', () => {
      renderWithRedux(<Sidebar {...mockProps} sessions={mockSessions} />);
      
      expect(screen.getByText('ዛሬ')).toBeInTheDocument();
      expect(screen.getByText('ትላንት')).toBeInTheDocument();
      expect(screen.getByText('ሰላም')).toBeInTheDocument();
      expect(screen.getByText('እንደምን አሉ')).toBeInTheDocument();
    });

    it('calls loadSession when a chat session is clicked', () => {
      renderWithRedux(<Sidebar {...mockProps} sessions={mockSessions} />);
      fireEvent.click(screen.getByText('ሰላም'));
      expect(mockProps.loadSession).toHaveBeenCalledWith('1');
    });

    it('calls deleteSession when delete button is clicked', () => {
      renderWithRedux(<Sidebar {...mockProps} sessions={mockSessions} />);
      const deleteButtons = screen.getAllByRole('button', { name: '' }); // Delete buttons have no accessible name
      fireEvent.click(deleteButtons[1]); // Click the first delete button
      expect(mockProps.deleteSession).toHaveBeenCalledWith('1');
    });

    it('highlights current session', () => {
      renderWithRedux(<Sidebar {...mockProps} sessions={mockSessions} currentSessionId="1" />);
      const currentSession = screen.getByText('ሰላም').closest('div');
      expect(currentSession).toHaveClass('bg-gray-100');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('closes sidebar when close button is clicked on mobile', () => {
      renderWithRedux(<Sidebar {...mockProps} />);
      const closeButton = screen.getByRole('button', { name: '' }); // Close button has no accessible name
      fireEvent.click(closeButton);
      expect(mockProps.setShowSidebar).toHaveBeenCalledWith(false);
      expect(mockProps.setShowSettings).toHaveBeenCalledWith(false);
    });
  });
});