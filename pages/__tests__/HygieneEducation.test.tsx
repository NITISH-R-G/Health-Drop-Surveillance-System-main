import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HygieneEducation from '../HygieneEducation';
import { ThemeProvider } from '../../lib/ThemeContext';

// Mock useSyncData hook
jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn().mockReturnValue({
    data: [{ id: '2', name: 'Test User A', score: 500, avatar: '👩‍⚕️', isUser: false }],
    loading: false,
    setData: jest.fn(),
  }),
}));

describe('HygieneEducation Component', () => {
  const mockProps = {
    onBack: jest.fn(),
    modules: [{ id: 1, title: 'Test Module', duration: '5 mins', points: 50, completed: false }],
    score: 100,
    onUpdateModule: jest.fn(),
  };

  it('renders the component and switches to leaderboard tab showing dynamic data', () => {
    const { getByText } = render(
      <ThemeProvider>
        <HygieneEducation {...mockProps} />
      </ThemeProvider>
    );

    // Initial render shows modules
    expect(getByText('Test Module')).toBeTruthy();

    // Switch to Leaderboard
    fireEvent.press(getByText('Leaderboard'));

    // Verify User and mocked User are present
    expect(getByText('You')).toBeTruthy();
    expect(getByText('Test User A')).toBeTruthy();
  });
});
