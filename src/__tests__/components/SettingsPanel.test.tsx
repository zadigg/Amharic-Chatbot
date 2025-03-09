import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SettingsPanel } from '../../components/SettingsPanel';
import settingsReducer from '../../store/slices/settingsSlice';

describe('SettingsPanel', () => {
  const mockProps = {
    showSettings: true,
    setShowSettings: vi.fn(),
    theme: 'light' as const
  };

  const renderWithRedux = (component: React.ReactElement) => {
    const store = configureStore({
      reducer: {
        settings: settingsReducer
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

  describe('Theme Settings', () => {
    it('renders theme selector with correct options', () => {
      renderWithRedux(<SettingsPanel {...mockProps} />);
      
      const themeSelect = screen.getByLabelText('ጭብጥ');
      expect(themeSelect).toBeInTheDocument();
      
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveTextContent('ብርሃን');
      expect(options[1]).toHaveTextContent('ጨለማ');
    });

    it('changes theme when selecting a different option', () => {
      const { store } = renderWithRedux(<SettingsPanel {...mockProps} />);
      
      const themeSelect = screen.getByLabelText('ጭብጥ');
      fireEvent.change(themeSelect, { target: { value: 'dark' } });
      
      expect(store.getState().settings.theme).toBe('dark');
    });
  });

  describe('Font Size Settings', () => {
    it('renders font size selector with correct options', () => {
      renderWithRedux(<SettingsPanel {...mockProps} />);
      
      const fontSizeSelect = screen.getByLabelText('የፊደል መጠን');
      expect(fontSizeSelect).toBeInTheDocument();
      
      const options = Array.from(fontSizeSelect.children);
      expect(options[0]).toHaveTextContent('ትንሽ');
      expect(options[1]).toHaveTextContent('መካከለኛ');
      expect(options[2]).toHaveTextContent('ትልቅ');
    });

    it('changes font size when selecting a different option', () => {
      const { store } = renderWithRedux(<SettingsPanel {...mockProps} />);
      
      const fontSizeSelect = screen.getByLabelText('የፊደል መጠን');
      fireEvent.change(fontSizeSelect, { target: { value: 'large' } });
      
      expect(store.getState().settings.fontSize).toBe('large');
    });
  });

  describe('Settings Panel Visibility', () => {
    it('toggles settings panel visibility', () => {
      renderWithRedux(<SettingsPanel {...mockProps} showSettings={false} />);
      
      const settingsButton = screen.getByRole('button');
      fireEvent.click(settingsButton);
      
      expect(mockProps.setShowSettings).toHaveBeenCalled();
    });

    it('shows settings content when settings are open', () => {
      renderWithRedux(<SettingsPanel {...mockProps} showSettings={true} />);
      
      const settingsContent = screen.getByTestId('settings-content');
      expect(settingsContent).toBeInTheDocument();
    });
  });

  describe('Language Settings', () => {
    it('renders language selector with correct options', () => {
      renderWithRedux(<SettingsPanel {...mockProps} />);
      
      const languageSelect = screen.getByLabelText('ቋንቋ');
      expect(languageSelect).toBeInTheDocument();
      
      const options = Array.from(languageSelect.children);
      expect(options[0]).toHaveTextContent('አማርኛ');
      expect(options[1]).toHaveTextContent('English');
    });

    it('changes language when selecting a different option', () => {
      const { store } = renderWithRedux(<SettingsPanel {...mockProps} />);
      
      const languageSelect = screen.getByLabelText('ቋንቋ');
      fireEvent.change(languageSelect, { target: { value: 'en' } });
      
      expect(store.getState().settings.language).toBe('en');
    });
  });
});