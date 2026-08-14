import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';

// Mock dependencies
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 11.0, longitude: 77.0 },
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} testID="mock-ionicons" />,
  };
});

describe('TestingLabs', () => {
  const mockLabs = [
    {
      id: '1',
      name: 'PSG Hospitals Laboratory',
      type: 'both',
      address: 'Peelamedu',
      phone: '12345',
      distance: '2.5 km',
      accredited: true,
      services: ['Pathology'],
      coordinates: { lat: 11.0, lng: 77.0 },
      isOpen: true,
    },
  ];

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
    // ActivityIndicator is rendered, testing-library exposes it by type or we can just rely on the component tree changing
    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(sync.useSyncData).toHaveBeenCalledWith('testingLabsData');
  });

  it('renders empty state when no labs exist', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
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

  it('renders labs successfully', () => {
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

    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
  });
});
