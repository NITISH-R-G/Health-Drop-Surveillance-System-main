import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import { Lab } from '../../types/models';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 11.0168,
      longitude: 76.9558,
    },
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} testID="mock-ionicons" />,
  };
});

const mockLabsData: Lab[] = [
  {
    id: '1',
    name: 'Sample Lab One',
    type: 'water',
    address: '123 Water St',
    phone: '123-456-7890',
    distance: '1.2 km',
    accredited: true,
    services: ['pH', 'Turbidity'],
    coordinates: { lat: 10, lng: 10 },
    isOpen: true,
  },
  {
    id: '2',
    name: 'Sample Lab Two',
    type: 'pathology',
    address: '456 Blood St',
    phone: '098-765-4321',
    distance: '3.4 km',
    accredited: false,
    services: ['Blood Test'],
    coordinates: { lat: 20, lng: 20 },
    isOpen: false,
  },
];

describe('TestingLabs Component', () => {
  it('renders a list of labs successfully', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs labs={mockLabsData} />
      </ThemeProvider>
    );

    expect(getByText('Sample Lab One')).toBeTruthy();
    expect(getByText('Sample Lab Two')).toBeTruthy();
    expect(getByText('1.2 km from you')).toBeTruthy();
  });

  it('handles empty state successfully', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs labs={[]} />
      </ThemeProvider>
    );

    expect(getByText('No labs found for this filter')).toBeTruthy();
  });

  it('filters labs by type', () => {
    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs labs={mockLabsData} />
      </ThemeProvider>
    );

    const waterFilterBtn = getByText('Water Testing');
    fireEvent.press(waterFilterBtn);

    expect(getByText('Sample Lab One')).toBeTruthy();
    expect(queryByText('Sample Lab Two')).toBeNull();
  });
});
