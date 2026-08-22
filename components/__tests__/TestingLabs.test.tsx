import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
import { Lab } from '../../types/models';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => React.createElement(View, { ...props, testID: 'icon' }),
  };
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 11.0, longitude: 77.0 },
  }),
}));

const mockLabs: Lab[] = [
  {
    id: '1',
    name: 'Test Lab One',
    type: 'water',
    address: '123 Test St',
    phone: '123-456-7890',
    distance: '1.0 km',
    accredited: true,
    services: ['Water Quality'],
    coordinates: { lat: 10, lng: 10 },
  },
];

describe('TestingLabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider>
        <TestingLabs {...props} />
      </ThemeProvider>
    );
  };

  it('renders loading state initially', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: null as any,
      loading: true,
      setData: jest.fn(),
    });

    const { getByTestId } = renderComponent();
    // Assuming ActivityIndicator is the only loading indicator and we don't have a testID,
    // we can check if labs aren't rendered or wait.
    // Given the implementation, when loading && !labs, ActivityIndicator is returned.
    expect(() => screen.getByText('Test Lab One')).toThrow();
  });

  it('renders labs from useSyncData when loaded', async () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Test Lab One')).toBeTruthy();
      expect(getByText('123 Test St')).toBeTruthy();
    });
  });

  it('renders labs from props if provided', async () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: null as any,
      loading: false,
      setData: jest.fn(),
    });

    const propLabs: Lab[] = [
      {
        id: '2',
        name: 'Prop Lab Two',
        type: 'pathology',
        address: '456 Prop Ave',
        phone: '098-765-4321',
        distance: '2.0 km',
        accredited: false,
        services: ['Blood Test'],
        coordinates: { lat: 20, lng: 20 },
      },
    ];

    const { getByText } = renderComponent({ labs: propLabs });

    await waitFor(() => {
      expect(getByText('Prop Lab Two')).toBeTruthy();
      expect(getByText('456 Prop Ave')).toBeTruthy();
    });
  });

  it('renders empty state when no labs match filter', async () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: [],
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('No labs found for this filter')).toBeTruthy();
    });
  });
});
