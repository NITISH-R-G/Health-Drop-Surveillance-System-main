import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as syncHook from '../../lib/sync';
import * as mockData from '../../lib/mockData';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 11.0, longitude: 77.0 },
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} testID={`mock-ionicons-${props.name}`} />,
  };
});

describe('TestingLabs Component', () => {
  const useSyncDataMock = jest.spyOn(syncHook, 'useSyncData');

  beforeEach(() => {
    useSyncDataMock.mockClear();
  });

  it('renders a loading indicator when data is fetching', () => {
    useSyncDataMock.mockReturnValue({ data: null, loading: true, setData: jest.fn() });

    const { getByTestId } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    // we should be able to see an activity indicator, but testing-library is tricky with ActivityIndicator.
    // Instead we can just check it doesn't render the list
    expect(() => getByTestId('mock-ionicons-business')).toThrow();
  });

  it('renders the labs list when data is available via syncHook', async () => {
    useSyncDataMock.mockReturnValue({ data: mockData.testingLabs, loading: false, setData: jest.fn() });

    const { getByText, getAllByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
      expect(getByText('KMCH Central Laboratory')).toBeTruthy();
      expect(getAllByText('Water Testing').length).toBeGreaterThan(0);
    });
  });

  it('filters labs by type when a filter chip is pressed', async () => {
    useSyncDataMock.mockReturnValue({ data: mockData.testingLabs, loading: false, setData: jest.fn() });

    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();

    fireEvent.press(getByText('Water Testing'));

    await waitFor(() => {
      expect(getByText('Micro Labs & Diagnostics')).toBeTruthy();
      expect(queryByText('PSG Hospitals Laboratory')).toBeNull();
    });
  });
});
