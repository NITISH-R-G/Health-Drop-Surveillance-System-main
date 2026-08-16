import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: null as any,
      loading: true,
      setData: jest.fn(),
    });

    const { getByTestId } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders empty state when there are no labs', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: [],
      loading: false,
      setData: jest.fn(),
    });

    const { getByTestId } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByTestId('empty-state')).toBeTruthy();
  });

  it('renders labs list correctly', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: testingLabs,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
    expect(getByText('Micro Labs & Diagnostics')).toBeTruthy();
  });
});
