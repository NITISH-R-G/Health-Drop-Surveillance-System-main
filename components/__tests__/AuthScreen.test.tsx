import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AuthScreen from '../AuthScreen';
import { ThemeProvider } from '../../lib/ThemeContext';

// Mock Expo vector icons to avoid warnings during testing
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: () => <View testID="mock-ionicons" />,
  };
});

describe('AuthScreen Component', () => {
  it('renders correctly', () => {
    const mockOnAuthSuccess = jest.fn();

    const { getByText, getByPlaceholderText } = render(
      <ThemeProvider>
        <AuthScreen onAuthSuccess={mockOnAuthSuccess} />
      </ThemeProvider>
    );

    // Using texts that actually exist in the component
    expect(getByText('HealthDrop')).toBeTruthy();
    expect(getByText('Welcome back')).toBeTruthy();
    expect(getByPlaceholderText('name@example.com')).toBeTruthy();
  });
});
