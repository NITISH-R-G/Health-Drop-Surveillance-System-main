import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as syncMod from '../../lib/sync';
import * as mockData from '../../lib/mockData';

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
    jest.spyOn(syncMod, 'useSyncData').mockReturnValue({
      data: mockData.testingLabsData,
      loading: false,
      setData: jest.fn(),
    });
  });

  it('renders correctly with synced data', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );
    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
    expect(getByText('Ganga Hospital Lab')).toBeTruthy();
  });

  it('filters labs by type', async () => {
    const { getByText, queryByText, getAllByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // Initial state 'all'
    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy(); // both
    expect(getByText('Ganga Hospital Lab')).toBeTruthy(); // pathology

    // Press 'Pathology' filter
    fireEvent.press(getAllByText('Pathology')[0]);

    await waitFor(() => {
        // Pathology or 'both' should be visible
        expect(getByText('PSG Hospitals Laboratory')).toBeTruthy(); // both
        expect(getByText('Ganga Hospital Lab')).toBeTruthy(); // pathology
    });

    // Press 'Water Testing' filter
    fireEvent.press(getByText('Water Testing'));

    await waitFor(() => {
        expect(getByText('PSG Hospitals Laboratory')).toBeTruthy(); // both
        expect(getByText('Tamil Nadu Water Supply and Drainage Board (TWAD)')).toBeTruthy(); // water
        expect(queryByText('Ganga Hospital Lab')).toBeNull(); // pathology - should not be visible
    });
  });

  it('handles finding location', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    const locationBtn = getByText('Find My Location');
    fireEvent.press(locationBtn);

    await waitFor(() => {
      expect(getByText('Location Found')).toBeTruthy();
    });
  });
});
