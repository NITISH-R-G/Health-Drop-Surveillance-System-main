import React from 'react';
import { render } from '@testing-library/react-native';
import HeroSection from '../HeroSection';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';

// Mock the hook to return the mocked data directly
jest.mock('../../lib/sync', () => {
  const actual = jest.requireActual('../../lib/sync');
  return {
    ...actual,
    useSyncData: jest.fn(),
  };
});

describe('HeroSection', () => {
  it('renders correctly with synced data', () => {
    const mockDashboardStats = {
      activeCases: 150,
      waterSourcesUnsafe: 5,
      alertsActive: 2,
      reportsToday: 10,
      fieldWorkers: 25,
      villagesAffected: 3,
      villagesTotal: 100,
      peopleEducated: 500,
    };

    (sync.useSyncData as jest.Mock).mockReturnValue({
      data: mockDashboardStats,
      loading: false,
    });

    const { getByText } = render(
      <ThemeProvider>
        <HeroSection userName="Test User" />
      </ThemeProvider>
    );

    // Using exact numbers to verify data ingestion
    expect(getByText('150')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
    expect(getByText('3/100')).toBeTruthy();
    expect(getByText('500')).toBeTruthy();
  });
});
