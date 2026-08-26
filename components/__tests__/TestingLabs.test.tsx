import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import { Lab } from '../../types/models';

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

const mockLabs: Lab[] = [
  {
    id: '1',
    name: 'Test Lab One',
    type: 'water',
    address: '123 Test St',
    phone: '123-456',
    distance: '1.0 km',
    accredited: true,
    services: ['Water test'],
    coordinates: { lat: 10, lng: 20 },
  },
  {
    id: '2',
    name: 'Test Lab Two',
    type: 'pathology',
    address: '456 Test Ave',
    phone: '987-654',
    distance: '2.5 km',
    accredited: false,
    services: ['Blood test'],
    coordinates: { lat: 30, lng: 40 },
  },
];

describe('TestingLabs', () => {
  it('renders correctly with labs prop', () => {
    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs labs={mockLabs} />
      </ThemeProvider>
    );

    expect(getByText('Test Lab One')).toBeTruthy();
    expect(getByText('Test Lab Two')).toBeTruthy();
  });

  it('handles empty labs array correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        {/* @ts-ignore */}
        <TestingLabs labs={undefined} />
      </ThemeProvider>
    );

    expect(getByText('No labs found for this filter')).toBeTruthy();
  });

  it('filters labs correctly', () => {
    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs labs={mockLabs} />
      </ThemeProvider>
    );

    const waterFilter = getByText('Water Testing');
    fireEvent.press(waterFilter);

    expect(getByText('Test Lab One')).toBeTruthy();
    expect(queryByText('Test Lab Two')).toBeNull();
  });
});
