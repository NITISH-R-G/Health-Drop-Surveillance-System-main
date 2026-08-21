import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';

// Mock dependencies
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 37.78825, longitude: -122.4324 },
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} testID="mock-ionicons" />,
  };
});

// Mock sync hook
jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

const mockLabs = [
  {
    id: '1',
    name: 'Test Lab 1',
    type: 'water',
    address: '123 Test St',
    phone: '123-456-7890',
    distance: '2.5 km',
    accredited: true,
    services: ['Water Testing'],
    coordinates: { lat: 10, lng: 10 },
  },
];

describe('TestingLabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is loading', () => {
    (sync.useSyncData as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      setData: jest.fn(),
    });

    const { getByTestId, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // Look for ActivityIndicator directly or implicitly via missing content
    expect(queryByText('Find My Location')).toBeNull();
  });

  it('renders labs list correctly', () => {
    (sync.useSyncData as jest.Mock).mockReturnValue({
      data: mockLabs,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('Test Lab 1')).toBeTruthy();
    expect(getByText('123 Test St')).toBeTruthy();
  });

  it('renders empty state when no labs match filter', () => {
    (sync.useSyncData as jest.Mock).mockReturnValue({
      data: [],
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
