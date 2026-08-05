import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 10,
      longitude: 10,
    },
  }),
}));

const mockLinking = {
  openURL: jest.fn(),
};
jest.mock('react-native/Libraries/Linking/Linking', () => mockLinking);


describe('TestingLabs', () => {
  it('renders correctly with default labs', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('All Labs')).toBeTruthy();
  });
});
