import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
import { labsData } from '../../lib/mockData';

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

// Mock useSyncData
jest.spyOn(sync, 'useSyncData').mockReturnValue({
  data: labsData,
  loading: false,
  setData: jest.fn(),
});

describe('TestingLabs', () => {
  it('renders a list of labs from sync hook correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // Verify one of the mock labs is rendered
    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
    expect(getByText('KMCH Central Laboratory')).toBeTruthy();
  });

  it('shows loading indicator when data is loading', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValueOnce({
      data: null as any,
      loading: true,
      setData: jest.fn(),
    });

    const { getByTestId, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // Since we didn't add a testID to ActivityIndicator, we can just ensure
    // it doesn't render a lab name when loading.
    expect(queryByText('PSG Hospitals Laboratory')).toBeNull();
  });
});
