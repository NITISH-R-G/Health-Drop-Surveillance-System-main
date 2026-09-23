import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
import * as Location from 'expo-location';

// Mock vector icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID="icon" {...props} />,
  };
});

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 11.0, longitude: 77.0 },
  }),
}));

const mockLabs = [
  {
    id: '1',
    name: 'PSG Hospitals Laboratory',
    type: 'both',
    address: 'Peelamedu, Coimbatore - 641004',
    phone: '0422-2570170',
    distance: '2.5 km',
    accredited: true,
    services: ['Pathology', 'Microbiology', 'Water testing'],
    coordinates: { lat: 11.018611, lng: 77.006944 },
  },
];

describe('TestingLabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
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

    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('renders correctly with data', () => {
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
    expect(getByText('Peelamedu, Coimbatore - 641004')).toBeTruthy();
  });

  it('requests location when location button is pressed', async () => {
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

    const locationButton = getByText('Find My Location');
    fireEvent.press(locationButton);

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(getByText('Location Found')).toBeTruthy();
    });
  });

  it('filters labs correctly', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: [...mockLabs, { ...mockLabs[0], id: '2', name: 'Water Lab', type: 'water' }] as any,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
    expect(getByText('Water Lab')).toBeTruthy();

    const waterFilterButton = getByText('Water Testing');
    fireEvent.press(waterFilterButton);

    expect(queryByText('PSG Hospitals Laboratory')).toBeNull();
    expect(getByText('Water Lab')).toBeTruthy();
  });
});
