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
    Ionicons: (props: any) => <View {...props} testID={`mock-ionicons-${props.name}`} />,
  };
});

describe('TestingLabs', () => {
  const mockLabs = [
    {
      id: '1',
      name: 'Test Lab 1',
      type: 'both',
      address: 'Test Address 1',
      phone: '1234567890',
      distance: '1.0 km',
      accredited: true,
      services: ['Service 1'],
      coordinates: { lat: 0, lng: 0 },
    },
    {
      id: '2',
      name: 'Test Lab 2',
      type: 'water',
      address: 'Test Address 2',
      phone: '0987654321',
      distance: '2.0 km',
      accredited: false,
      services: ['Service 2'],
      coordinates: { lat: 1, lng: 1 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    jest
      .spyOn(sync, 'useSyncData')
      .mockReturnValue({ data: null, loading: true, setData: jest.fn() });

    const { getByTestId } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders labs data successfully', () => {
    jest
      .spyOn(sync, 'useSyncData')
      .mockReturnValue({ data: mockLabs, loading: false, setData: jest.fn() });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('Test Lab 1')).toBeTruthy();
    expect(getByText('Test Address 1')).toBeTruthy();
    expect(getByText('Test Lab 2')).toBeTruthy();
    expect(getByText('Test Address 2')).toBeTruthy();
  });
});
