import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Navbar from '../Navbar';
import { ThemeProvider } from '../../lib/ThemeContext';

// Mock the react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: () => ({ top: 20, right: 0, bottom: 0, left: 0 }),
  };
});

// Define mock functions
const mockOnMenuPress = jest.fn();
const mockToggleTheme = jest.fn();
const mockOnNavigate = jest.fn();

const defaultProps = {
  userName: 'John Doe',
  onMenuPress: mockOnMenuPress,
  toggleTheme: mockToggleTheme,
  onNavigate: mockOnNavigate,
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderNavbar = (props = {}) => {
    return render(
      <ThemeProvider>
        <Navbar {...defaultProps} {...props} />
      </ThemeProvider>
    );
  };

  it('renders correctly and displays initials from userName', () => {
    const { getByText } = renderNavbar({ userName: 'Jane Smith' });

    // Check if the app name and tagline exist
    expect(getByText('HealthDrop')).toBeTruthy();
    expect(getByText('Surveillance System')).toBeTruthy();

    // Check if initials are rendered correctly
    expect(getByText('JS')).toBeTruthy();
  });

  it('triggers onMenuPress when menu button is pressed', () => {
    const { getByTestId } = renderNavbar();
    const menuButton = getByTestId('menu-button');

    fireEvent.press(menuButton);
    expect(mockOnMenuPress).toHaveBeenCalledTimes(1);
  });

  it('triggers toggleTheme when theme toggle button is pressed', () => {
    const { getByTestId } = renderNavbar();
    const themeButton = getByTestId('theme-toggle-button');

    fireEvent.press(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('triggers onNavigate with "Warnings" when notification button is pressed', () => {
    const { getByTestId } = renderNavbar();
    const notificationButton = getByTestId('notification-button');

    fireEvent.press(notificationButton);
    expect(mockOnNavigate).toHaveBeenCalledWith('Warnings');
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });

  it('triggers onNavigate with "Profile" when avatar is pressed', () => {
    const { getByTestId } = renderNavbar();
    const profileButton = getByTestId('profile-button');

    fireEvent.press(profileButton);
    expect(mockOnNavigate).toHaveBeenCalledWith('Profile');
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });

  it('does not throw errors when onNavigate is not provided', () => {
    // Render without onNavigate
    const { getByTestId } = render(
      <ThemeProvider>
        <Navbar
          userName="No Nav"
          onMenuPress={mockOnMenuPress}
          toggleTheme={mockToggleTheme}
        />
      </ThemeProvider>
    );

    const notificationButton = getByTestId('notification-button');
    const profileButton = getByTestId('profile-button');

    // Press notification button (should not throw, should just do nothing)
    expect(() => fireEvent.press(notificationButton)).not.toThrow();

    // Press avatar (should not throw, should just do nothing)
    expect(() => fireEvent.press(profileButton)).not.toThrow();
  });
});
