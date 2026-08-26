import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import { useSyncData } from '../../lib/sync';

jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

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
    (useSyncData as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
    });

    const { getByTestId, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // We expect ActivityIndicator to be rendered when loading and no propLabs are provided
    // ActivityIndicator is hard to query directly without a testID, but we can verify that
    // nothing from the normal state is rendered.
    expect(queryByText('Find My Location')).toBeNull();
  });

  it('renders lab items correctly when data is available', () => {
    const mockLabs = [
      {
        id: '1',
        name: 'Mock Lab 1',
        type: 'both',
        address: '123 Mock St',
        phone: '1234567890',
        distance: '2.5 km',
        accredited: true,
        services: ['Test A', 'Test B'],
        coordinates: { lat: 10, lng: 10 },
      },
    ];

    (useSyncData as jest.Mock).mockReturnValue({
      data: mockLabs,
      loading: false,
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('Mock Lab 1')).toBeTruthy();
    expect(getByText('123 Mock St')).toBeTruthy();
    expect(getByText('Test A')).toBeTruthy();
  });
});
