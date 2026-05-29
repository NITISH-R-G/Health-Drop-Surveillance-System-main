import React from 'react';
import { render } from '@testing-library/react-native';
import AlertBanner from '../AlertBanner';
import { AlertItem } from '../../lib/mockData';

// Mock Expo vector icons to avoid warnings during testing
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: () => <View testID="mock-ionicons" />,
  };
});

// Mock the ThemeContext
jest.mock('../../lib/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.8)',
      glassBorder: 'rgba(0, 0, 0, 0.1)',
      error: '#ff0000',
      warning: '#ffa500',
      primary: '#0000ff',
      text: '#000000',
      textSecondary: '#666666',
      textTertiary: '#999999',
    },
  }),
  typography: {
    subhead: { fontSize: 16 },
    caption1: { fontSize: 14 },
    caption2: { fontSize: 12 },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
  radius: {
    lg: 12,
  },
}));

describe('AlertBanner', () => {
  it('renders critical alert correctly', () => {
    const alerts: AlertItem[] = [
      {
        id: 1,
        title: 'Contaminated Water',
        message: 'Do not drink tap water in Region A',
        severity: 'critical',
        timestamp: '2023-10-27T10:00:00Z',
        regionId: 'reg-a',
        region: 'Region A',
        isRead: false,
        category: 'water',
      },
    ];

    const { getByText } = render(<AlertBanner alerts={alerts} />);

    expect(getByText('Contaminated Water')).toBeTruthy();
    expect(getByText('Do not drink tap water in Region A')).toBeTruthy();
  });

  it('renders high severity alert correctly', () => {
    const alerts: AlertItem[] = [
      {
        id: 1,
        title: 'Contaminated Water',
        message: 'Do not drink tap water in Region A',
        severity: 'high',
        timestamp: '2023-10-27T10:00:00Z',
        regionId: 'reg-a',
        region: 'Region A',
        isRead: false,
        category: 'water',
      },
    ];

    const { getByText } = render(<AlertBanner alerts={alerts} />);

    expect(getByText('Contaminated Water')).toBeTruthy();
    expect(getByText('Do not drink tap water in Region A')).toBeTruthy();
  });

  it('does not render read alerts', () => {
    const alerts: AlertItem[] = [
      {
        id: 1,
        title: 'Contaminated Water',
        message: 'Do not drink tap water in Region A',
        severity: 'critical',
        timestamp: '2023-10-27T10:00:00Z',
        regionId: 'reg-a',
        region: 'Region A',
        isRead: true, // Mark as read
        category: 'water',
      },
    ];

    const { queryByText } = render(<AlertBanner alerts={alerts} />);

    expect(queryByText('Contaminated Water')).toBeNull();
  });

  it('does not render low severity alerts', () => {
    const alerts: AlertItem[] = [
      {
        id: 1,
        title: 'Mild issue',
        message: 'Nothing to worry about',
        severity: 'low',
        timestamp: '2023-10-27T10:00:00Z',
        regionId: 'reg-a',
        region: 'Region A',
        isRead: false,
        category: 'water',
      },
    ];

    const { queryByText } = render(<AlertBanner alerts={alerts} />);

    expect(queryByText('Mild issue')).toBeNull();
  });
});
