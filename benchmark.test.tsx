import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from './components/TestingLabs';
import { ThemeProvider } from './lib/ThemeContext';

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
    name: 'Ganga Hospital Lab',
    type: 'pathology',
    address: 'Ramnagar, Coimbatore - 641009',
    phone: '0422-2485000',
    email: 'info@gangahospital.com',
    timings: '24 Hours',
    isOpen: true,
    distance: '3.2 km',
    accredited: true,
    services: ['Clinical Pathology', 'Biochemistry', 'Hematology'],
    coordinates: { lat: 11.008453, lng: 76.958215 },
  },
];

jest.mock('./lib/sync', () => ({
  useSyncData: jest.fn().mockReturnValue({
    data: mockTestingLabsData,
    loading: false,
    setData: jest.fn(),
  }),
}));

describe('TestingLabs Benchmark', () => {
  it('renders multiple times to benchmark', () => {
    const numRenders = 1000;

    console.time('TestingLabs Render');
    for (let i = 0; i < numRenders; i++) {
      const { unmount } = render(
        <ThemeProvider>
          <TestingLabs />
        </ThemeProvider>
      );
      unmount();
    }
    console.timeEnd('TestingLabs Render');
  });
});
