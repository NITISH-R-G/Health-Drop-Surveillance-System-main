import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import { useSyncData } from '../../lib/sync';
import { Lab } from '../../types/models';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 37.78825, longitude: -122.4324 },
  }),
}));

jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

const mockLabs: Lab[] = [
  {
    id: '1',
    name: 'Test Lab 1',
    type: 'water',
    address: '123 Test St',
    phone: '123-456-7890',
    distance: '1.5 km',
    accredited: true,
    services: ['Water Quality'],
    coordinates: { lat: 10, lng: 10 },
  },
  {
    id: '2',
    name: 'Test Lab 2',
    type: 'pathology',
    address: '456 Path St',
    phone: '098-765-4321',
    distance: '3.0 km',
    accredited: false,
    services: ['Blood Test'],
    coordinates: { lat: 11, lng: 11 },
  },
];

describe('TestingLabs', () => {
  beforeEach(() => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: mockLabs,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with synced data', () => {
    const { getByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    expect(getByText('Test Lab 1')).toBeTruthy();
    expect(getByText('Test Lab 2')).toBeTruthy();
  });

  it('filters labs correctly', () => {
    const { getByText, queryByText } = render(
      <ThemeProvider>
        <TestingLabs />
      </ThemeProvider>
    );

    const waterFilterBtn = getByText('Water Testing');
    fireEvent.press(waterFilterBtn);

    expect(getByText('Test Lab 1')).toBeTruthy();
    expect(queryByText('Test Lab 2')).toBeNull();
  });
});
