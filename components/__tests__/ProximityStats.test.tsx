import React from 'react';
import { render } from '@testing-library/react-native';
import ProximityStats from '../ProximityStats';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';

jest.mock('../../lib/sync', () => {
  const actual = jest.requireActual('../../lib/sync');
  return {
    ...actual,
    useSyncData: jest.fn(),
  };
});

describe('ProximityStats', () => {
  it('renders and integrates with useSyncData properly', () => {
    const mockOutbreaks = [
      {
        id: '1',
        status: 'active',
        caseCount: 15,
        coordinates: { latitude: 11.0, longitude: 77.0 },
      },
    ];

    (sync.useSyncData as jest.Mock).mockReturnValue({
      data: mockOutbreaks,
      loading: false,
    });

    const { getByText } = render(
      <ThemeProvider>
        <ProximityStats userLocation={{ lat: 11.0, lng: 77.0 }} />
      </ThemeProvider>
    );

    // Since our mock is at exactly the same coordinates as the user, distance is 0, so it will fall within the rings
    expect(getByText('15')).toBeTruthy(); // 15 cases
    expect(getByText('1')).toBeTruthy(); // 1 contamination
  });
});
