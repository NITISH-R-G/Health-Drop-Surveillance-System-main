import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../Card';
import { Text } from 'react-native';
import { ThemeProvider } from '../../lib/ThemeContext';

// Mock Expo vector icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: () => <View testID="mock-ionicons" />,
  };
});

// Mock expo-blur
jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return {
    BlurView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

describe('Card Component', () => {
  it('renders correctly with content', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ThemeProvider>
        <Card
          title="Test Title"
          description="Test Description"
          date="2023-01-01"
          location="Test Location"
          type="outbreak"
          severity="high"
          onPress={mockOnPress}
        />
      </ThemeProvider>
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('renders severity correctly if passed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <ThemeProvider>
        <Card
          title="Test"
          description="Test Description"
          date="2023-01-01"
          location="Test Location"
          type="outbreak"
          severity="high"
          onPress={mockOnPress}
        />
      </ThemeProvider>
    );

    expect(getByText('HIGH')).toBeTruthy();
  });
});
