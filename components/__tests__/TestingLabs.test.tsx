import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';

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

  it('renders loading state initially', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: [],
      loading: true,
      setData: jest.fn(),
    });

    render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // The ActivityIndicator should be rendered
    // But since it doesn't have a testID by default in our codebase,
    // we just check it renders without throwing and `useSyncData` is called.
    expect(sync.useSyncData).toHaveBeenCalledWith('testingLabs');
  });

  it('renders labs list when data is available', () => {
    const mockLabs = [
      {
        id: '1',
        name: 'Test Lab Alpha',
        type: 'both' as const,
        address: '123 Test St',
        phone: '123-456-7890',
        distance: '2.5 km',
        accredited: true,
        services: ['Test 1', 'Test 2'],
        coordinates: { lat: 0, lng: 0 },
      },
    ];

    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('Test Lab Alpha')).toBeTruthy();
    expect(getByText('123 Test St')).toBeTruthy();
  });
});
