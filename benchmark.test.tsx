import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from './components/TestingLabs';
import { ThemeProvider } from './lib/ThemeContext';

jest.mock('./lib/sync', () => {
  const { testingLabsData } = require('./lib/mockData');
  return {
    useSyncData: jest.fn().mockReturnValue({
      data: testingLabsData,
      loading: false,
    }),
  };
});

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
