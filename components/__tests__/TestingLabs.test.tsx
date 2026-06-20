import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import { useSyncData } from '../../lib/sync';
import { testingLabs } from '../../lib/mockData';

// Mock the useSyncData hook
jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  }),
}));

describe('TestingLabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      setData: jest.fn(),
    });

    const { UNSAFE_getByType } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders the fetched testing labs data correctly', () => {
    (useSyncData as jest.Mock).mockReturnValue({
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
    expect(getByText('KMCH Central Laboratory')).toBeTruthy();
  });

  it('handles empty data fallback safely', () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('No labs found for this filter')).toBeTruthy();
  });
});
