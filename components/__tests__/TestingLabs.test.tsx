import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import { testingLabs } from '../../lib/mockData';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} testID="mock-ionicons" />,
  };
});

describe('TestingLabs', () => {
  it('renders correctly with dynamic data', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs labs={testingLabs} />
      </ThemeProvider>
    );

    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
  });

  it('filters labs by type', () => {
    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs labs={testingLabs} />
      </ThemeProvider>
    );

    const waterFilter = getByText('Water Testing');
    fireEvent.press(waterFilter);

    expect(getByText('TWAD Board Water Testing Lab')).toBeTruthy();
    expect(queryByText('PSG Hospitals Laboratory')).toBeNull();
  });
});
