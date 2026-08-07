import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
import * as mockData from '../../lib/mockData';

// Mock location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  }),
}));

// Mock icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} testID="mock-ionicons" />,
  };
});

describe('TestingLabs', () => {
  const mockSyncData = jest.spyOn(sync, 'useSyncData');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator when data is syncing', () => {
    mockSyncData.mockReturnValue({
      data: [] as any,
      loading: true,
      setData: jest.fn(),
    });

    const { getByTestId, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // FlatList shouldn't be rendering the labs if loading
    expect(queryByText('PSG Hospitals Laboratory')).toBeNull();
  });

  it('renders labs from sync data', () => {
    mockSyncData.mockReturnValue({
      data: mockData.testingLabsData,
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

  it('filters labs by type', async () => {
    mockSyncData.mockReturnValue({
      data: mockData.testingLabsData,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText, queryByText, getAllByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // Initial render shows all
    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy(); // both
    expect(getByText('Ganga Hospital Lab')).toBeTruthy(); // pathology

    // Click pathology filter
    const pathologyFilter = getAllByText('Pathology')[0];
    fireEvent.press(pathologyFilter);

    await waitFor(() => {
        expect(getByText('Ganga Hospital Lab')).toBeTruthy(); // remains
        expect(queryByText('PSG Hospitals Laboratory')).toBeNull(); // filtered out
    });
  });

  it('renders empty state when no labs match filter', async () => {
    // Provide a mocked subset where there are no 'water' type labs
    mockSyncData.mockReturnValue({
      data: [mockData.testingLabsData[2]], // Only Ganga (pathology)
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    const waterFilter = getByText('Water Testing');
    fireEvent.press(waterFilter);

    await waitFor(() => {
        expect(getByText('No labs found for this filter')).toBeTruthy();
    });
  });
});
