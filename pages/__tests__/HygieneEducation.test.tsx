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
    modules: [
      {
        id: 1,
        title: 'Test Module',
        duration: '5 mins',
        points: 50,
        completed: false,
        description: 'Test Description',
        quizQuestion: 'Test Quiz Question',
        quizOptions: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswerIndex: 1,
      },
    ],
    score: 100,
    onUpdateModule: jest.fn(),
  };

  it('renders the component, handles learning and dynamic quiz submission', () => {
    const { getByText } = render(
      <ThemeProvider>
        <HygieneEducation {...mockProps} />
      </ThemeProvider>
    );

    // Click module to open learning viewer
    fireEvent.press(getByText('Test Module'));

    // Verify description is shown
    expect(getByText('Test Description')).toBeTruthy();

    // Proceed to quiz
    fireEvent.press(getByText("I've finished reading ➔ Take Quiz"));

    // Verify dynamic question and options
    expect(getByText('Test Quiz Question')).toBeTruthy();
    expect(getByText('Option A')).toBeTruthy();

    // Select wrong answer (0)
    fireEvent.press(getByText('Option A'));
    fireEvent.press(getByText('Submit Answer'));
    expect(mockProps.onUpdateModule).not.toHaveBeenCalled();

    // Select right answer (1)
    fireEvent.press(getByText('Option B'));
    fireEvent.press(getByText('Submit Answer'));
    expect(mockProps.onUpdateModule).toHaveBeenCalledWith(1, 50);
  });

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
