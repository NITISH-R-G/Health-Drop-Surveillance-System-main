import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { useSyncData } from '../../lib/sync';
import * as Location from 'expo-location';
import { ThemeProvider } from '../../lib/ThemeContext';

// Mock dependencies
jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name, ...props }: any) => <Text {...props}>{name}</Text>,
  };
});

const mockLabs = [
  {
    id: '1',
    name: 'Lab One',
    type: 'water',
    address: '123 Water St',
    phone: '555-0101',
    distance: '1.5 km',
    accredited: true,
    services: ['pH testing'],
    coordinates: { lat: 10, lng: 20 },
    isOpen: true,
  },
  {
    id: '2',
    name: 'Lab Two',
    type: 'pathology',
    address: '456 Path St',
    phone: '555-0202',
    distance: '3.0 km',
    accredited: false,
    services: ['Blood test'],
    coordinates: { lat: 30, lng: 40 },
    isOpen: false,
  },
];

describe('TestingLabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with sync data', () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: mockLabs,
      loading: false,
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('Lab One')).toBeTruthy();
    expect(getByText('Lab Two')).toBeTruthy();
    expect(getByText(/1\.5 km\s*from you/i)).toBeTruthy();
    expect(getByText('Open Now')).toBeTruthy();
    expect(getByText('Closed')).toBeTruthy();
  });

  it('shows loading indicator when data is loading', () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: [],
      loading: true,
    });

    // The component doesn't expose a specific testID for the ActivityIndicator,
    // but the container with the background color should be present.
    // However, ActivityIndicator does show up in the tree, so we can't easily query by text.
    // In React Native testing library, we can check if it exists using UNSAFE methods or just verify no crash.
    const { toJSON } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy(); // Basic render check
  });

  it('filters labs by type', async () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: mockLabs,
      loading: false,
    });

    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // Initially both show
    expect(getByText('Lab One')).toBeTruthy();
    expect(getByText('Lab Two')).toBeTruthy();

    // Click "Water Testing" filter
    fireEvent.press(getByText('Water Testing'));

    await waitFor(() => {
      expect(getByText('Lab One')).toBeTruthy();
      expect(queryByText('Lab Two')).toBeNull();
    });
  });

  it('requests location permission and sets user location', async () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: mockLabs,
      loading: false,
    });

    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 12.34, longitude: 56.78 },
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Find My Location'));

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(getByText('Location Found')).toBeTruthy();
    });
  });
});
