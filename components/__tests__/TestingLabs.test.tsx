import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
import * as Location from 'expo-location';

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockLabs = [
    {
      id: '1',
      name: 'Test Lab 1',
      type: 'water',
      address: 'Test Address 1',
      phone: '12345',
      distance: '1.0 km',
      accredited: true,
      services: ['Water test 1'],
      coordinates: { lat: 0, lng: 0 },
    },
    {
      id: '2',
      name: 'Test Lab 2',
      type: 'pathology',
      address: 'Test Address 2',
      phone: '67890',
      distance: '2.0 km',
      accredited: false,
      services: ['Pathology test 1'],
      coordinates: { lat: 1, lng: 1 },
    },
  ];

  it('renders loading state when loading and no data is provided via props', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: null as any,
      loading: true,
      setData: jest.fn(),
    });

    const { UNSAFE_getByType } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeDefined();
  });

  it('renders synced data', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs as any,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('Test Lab 1')).toBeTruthy();
    expect(getByText('Test Lab 2')).toBeTruthy();
  });

  it('filters labs by type', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs as any,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Water Testing'));

    expect(getByText('Test Lab 1')).toBeTruthy();
    expect(queryByText('Test Lab 2')).toBeNull();
  });

  it('fetches user location on button press', async () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs as any,
      loading: false,
      setData: jest.fn(),
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
