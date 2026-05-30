import React from 'react';
import { render } from '@testing-library/react-native';
import RiskHeatmap from '../RiskHeatmap';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as sync from '../../lib/sync';

jest.mock('../../lib/sync', () => {
  return {
    useSyncData: jest.fn((key) => {
      if (key === 'regions') {
        return {
          data: [
            { id: 'all', name: 'All Regions' },
            {
              id: 'coimbatore',
              name: 'Coimbatore',
              riskLevel: 'high',
              riskScore: 85,
              activeCases: 10,
            },
          ],
          loading: false,
        };
      }
      if (key === 'waterQualityAlerts') {
        return {
          data: [
            {
              id: '1',
              regionId: 'coimbatore',
              title: 'Test Alert',
              location: 'Location',
              status: 'active',
            },
          ],
          loading: false,
        };
      }
      return { data: [], loading: false };
    }),
  };
});

// Mock MapView and inner components from react-native-maps as they don't render nicely in simple jest test by default
jest.mock('../Map', () => {
  const React = require('react');
  const MapView = ({ children }: any) => <>{children}</>;
  const Marker = () => <></>;
  const Circle = () => <></>;

  MapView.Marker = Marker;
  MapView.Circle = Circle;
  return {
    __esModule: true,
    default: MapView,
    Marker,
    Circle,
  };
});

describe('RiskHeatmap', () => {
  it('renders and fetches data correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <RiskHeatmap selectedRegion="all" />
      </ThemeProvider>
    );

    expect(getByText('Regional Risk Map & Contamination Data')).toBeTruthy();
  });
});
