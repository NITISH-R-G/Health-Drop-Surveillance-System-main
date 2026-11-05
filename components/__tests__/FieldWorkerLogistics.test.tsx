import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FieldWorkerLogistics from '../FieldWorkerLogistics';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';

// Mock dependencies
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

const mockInventory = [
  { id: '1', name: 'ORS Packets', stock: 1250, unit: 'pkts', reorderLevel: 500, icon: 'medical' },
];

const mockMissions = [
  {
    id: 'm1',
    title: 'Containment Line Setup',
    location: 'Singanallur (Ward 12)',
    priority: 'high',
    requires: ['ORS Packets'],
    status: 'pending',
  },
];

describe('FieldWorkerLogistics', () => {
  const setMissionsMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (sync.useSyncData as jest.Mock).mockImplementation((key) => {
      if (key === 'fieldMissions') {
        return { data: mockMissions, setData: setMissionsMock, loading: false };
      }
      if (key === 'fieldInventory') {
        return { data: mockInventory, loading: false };
      }
      return { data: null, loading: false };
    });
  });

  it('renders loading state when data is syncing', () => {
    (sync.useSyncData as jest.Mock).mockReturnValue({ data: null, loading: true });

    const { getByTestId } = render(
      <ThemeProvider>
        <FieldWorkerLogistics />
      </ThemeProvider>
    );

    // ActivityIndicator is rendered, we can check for it implicitly
    // or by checking the absence of other text.
    expect(() =>
      render(
        <ThemeProvider>
          <FieldWorkerLogistics />
        </ThemeProvider>
      ).getByText('Critical Supplies Inventory')
    ).toThrow();
  });

  it('renders inventory and missions data correctly', () => {
    const { getByText, getAllByText } = render(
      <ThemeProvider>
        <FieldWorkerLogistics />
      </ThemeProvider>
    );

    expect(getByText('Critical Supplies Inventory')).toBeTruthy();
    expect(getAllByText('ORS Packets').length).toBeGreaterThan(0);
    expect(getByText('1250')).toBeTruthy();

    expect(getByText('Active Dispatches')).toBeTruthy();
    expect(getByText('Containment Line Setup')).toBeTruthy();
    expect(getByText('Singanallur (Ward 12)')).toBeTruthy();
    expect(getByText('PENDING')).toBeTruthy();
  });

  it('handles mission status update correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <FieldWorkerLogistics />
      </ThemeProvider>
    );

    // Initial status is pending, button should say 'Start Deployment'
    const startButton = getByText('Start Deployment');
    fireEvent.press(startButton);

    // We expect the setMissionsMock to be called with a function that updates the status
    expect(setMissionsMock).toHaveBeenCalled();
    const updateFn = setMissionsMock.mock.calls[0][0];

    // Test the update function directly since it's a setState callback
    const updatedMissions = updateFn(mockMissions);
    expect(updatedMissions[0].status).toBe('in-progress');
  });

  it('handles auto dispatch correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <FieldWorkerLogistics />
      </ThemeProvider>
    );

    const autoDispatchButton = getByText('AI Auto-Dispatch');
    fireEvent.press(autoDispatchButton);

    expect(setMissionsMock).toHaveBeenCalled();
    const updateFn = setMissionsMock.mock.calls[0][0];

    const updatedMissions = updateFn(mockMissions);
    expect(updatedMissions[0].status).toBe('in-progress');
  });
});
