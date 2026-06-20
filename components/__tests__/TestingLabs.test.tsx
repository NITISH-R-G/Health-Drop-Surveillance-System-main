import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import { useSyncData } from '../../lib/sync';

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

const mockTestingLabsData = [
  {
    id: '1',
    name: 'PSG Hospitals Laboratory',
    type: 'both',
    address: 'Peelamedu, Coimbatore - 641004',
    phone: '0422-2570170',
    email: 'psghospitals@yahoo.co.in',
    timings: '24 Hours',
    isOpen: true,
    distance: '2.5 km',
    accredited: true,
    services: ['Pathology', 'Microbiology', 'Water testing'],
    coordinates: { lat: 11.018611, lng: 77.006944 },
  },
  {
    id: '2',
    name: 'KMCH Central Laboratory',
    type: 'both',
    address: 'Avinashi Road, Coimbatore - 641014',
    phone: '0422-4323800',
    email: 'info@kmchhospitals.com',
    timings: '24 Hours',
    isOpen: true,
    distance: '4.2 km',
    accredited: true,
    services: ['Full panel testing', 'Biochemistry', 'Clinical Pathology'],
    coordinates: { lat: 11.042607, lng: 77.040607 },
  },
];

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

    const { getByTestId, UNSAFE_getByType } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders the fetched testing labs data correctly', () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: mockTestingLabsData,
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
