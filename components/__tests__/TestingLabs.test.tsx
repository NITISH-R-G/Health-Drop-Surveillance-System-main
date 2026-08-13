import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
import { Lab } from '../../types/models';

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID={`icon-${props.name}`} />,
  };
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 10, longitude: 20 } }),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

const mockLabs: Lab[] = [
  {
    id: '1',
    name: 'Test Water Lab',
    type: 'water',
    address: '123 Test St',
    phone: '123-456-7890',
    distance: '1.2 km',
    accredited: true,
    services: ['pH testing'],
    coordinates: { lat: 10, lng: 20 },
    isOpen: true,
  },
  {
    id: '2',
    name: 'Test Path Lab',
    type: 'pathology',
    address: '456 Path Ave',
    phone: '098-765-4321',
    distance: '3.4 km',
    accredited: false,
    services: ['Blood test'],
    coordinates: { lat: 11, lng: 21 },
    isOpen: false,
  },
];

describe('TestingLabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <ThemeProvider>
        <TestingLabs {...props} />
      </ThemeProvider>
    );

  it('renders loading state initially', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: null as any,
      loading: true,
      setData: jest.fn(),
    });

    const { getByTestId, UNSAFE_getByType } = renderComponent();

    // We expect ActivityIndicator to be rendered. We can check by its presence or type
    expect(UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
  });

  it('renders empty state when no labs are returned', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: [],
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = renderComponent();
    expect(getByText('No labs found for this filter')).toBeTruthy();
  });

  it('renders labs from sync data', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = renderComponent();
    expect(getByText('Test Water Lab')).toBeTruthy();
    expect(getByText('Test Path Lab')).toBeTruthy();
    expect(getByText('123 Test St')).toBeTruthy();
    expect(getByText('✓ Approved')).toBeTruthy(); // Because Test Water Lab is accredited
  });

  it('filters labs by type', async () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText, queryByText } = renderComponent();

    // Both labs should be present initially
    expect(getByText('Test Water Lab')).toBeTruthy();
    expect(getByText('Test Path Lab')).toBeTruthy();

    // Click the Water Testing filter
    fireEvent.press(getByText('Water Testing'));

    await waitFor(() => {
      expect(getByText('Test Water Lab')).toBeTruthy();
      expect(queryByText('Test Path Lab')).toBeNull();
    });

    // Click the Pathology filter
    fireEvent.press(getByText('Pathology'));

    await waitFor(() => {
      expect(queryByText('Test Water Lab')).toBeNull();
      expect(getByText('Test Path Lab')).toBeTruthy();
    });
  });

  it('allows overriding labs via props', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: [], // empty remote data
      loading: false,
      setData: jest.fn(),
    });

    const customLabs: Lab[] = [
      {
        id: '3',
        name: 'Prop Lab',
        type: 'both',
        address: '789 Prop Rd',
        phone: '555-5555',
        distance: '5.0 km',
        accredited: true,
        services: ['Everything'],
        coordinates: { lat: 12, lng: 22 },
        isOpen: true,
      },
    ];

    const { getByText, queryByText } = renderComponent({ labs: customLabs });

    expect(getByText('Prop Lab')).toBeTruthy();
    expect(queryByText('Test Water Lab')).toBeNull(); // Should not see the mockLabs
  });
});
