import React from 'react';
import { render } from '@testing-library/react-native';
import TestingLabs from '../TestingLabs';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';
import { labs as mockLabs } from '../../lib/mockData';

// Mock the sync hook
jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

describe('TestingLabs', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: null as any,
      loading: true,
      setData: jest.fn(),
    });

    const { getByTestId, queryByText } = renderWithTheme(<TestingLabs />);
    // We expect no labs to be rendered
    expect(queryByText('PSG Hospitals Laboratory')).toBeNull();
  });

  it('renders labs list correctly after loading', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: mockLabs,
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = renderWithTheme(<TestingLabs />);

    expect(getByText('PSG Hospitals Laboratory')).toBeTruthy();
    expect(getByText('KMCH Central Laboratory')).toBeTruthy();
  });

  it('renders empty state when no labs exist', () => {
    jest.spyOn(sync, 'useSyncData').mockReturnValue({
      data: [],
      loading: false,
      setData: jest.fn(),
    });

    const { getByText } = renderWithTheme(<TestingLabs />);

    expect(getByText('No labs found for this filter')).toBeTruthy();
  });
});
