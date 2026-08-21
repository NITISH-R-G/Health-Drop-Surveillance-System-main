import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfilePage from '../ProfilePage';
import * as sync from '../../lib/sync';
import { ThemeProvider } from '../../lib/ThemeContext';

jest.mock('../../lib/sync', () => ({
  ...jest.requireActual('../../lib/sync'),
  useSyncData: jest.fn(),
}));

describe('ProfilePage', () => {
  const mockOnBack = jest.fn();
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTheme = (component: React.ReactNode) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('renders loading state correctly', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: null as any,
      loading: true,
      setData: jest.fn(),
    });

    const { getByText, queryByText } = renderWithTheme(
      <ProfilePage onBack={mockOnBack} onNavigate={mockOnNavigate} userName="Test User" />
    );

    expect(getByText('Test User')).toBeTruthy();
    expect(queryByText('HEALTH WORKER')).toBeNull(); // Should be loading
  });

  it('renders dynamic stats correctly', async () => {
    const mockProfileStats = {
      reports: 156,
      regions: 32,
      badges: 4,
      role: 'SUPER ADMIN',
    };

    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockProfileStats,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = renderWithTheme(
      <ProfilePage onBack={mockOnBack} onNavigate={mockOnNavigate} />
    );

    expect(getByText('SUPER ADMIN')).toBeTruthy();
    expect(getByText('156')).toBeTruthy();
    expect(getByText('32')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
  });
});
