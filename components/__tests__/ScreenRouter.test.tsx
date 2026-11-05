import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ScreenRouter, { ScreenRouterProps } from '../ScreenRouter';
import { Theme } from '../../lib/ThemeContext';

// Mock dependencies
import { View } from 'react-native';

// jest.mock factory function executes before outer variables.
// Define them directly inside mock to avoid "MockComponent is not a function"

jest.mock('../../pages/NationalStats', () => {
  const { View } = require('react-native');
  return () => <View testID="NationalStats" />;
});
jest.mock('../../pages/ProfilePage', () => {
  const { View } = require('react-native');
  return () => <View testID="ProfilePage" />;
});
jest.mock('../../pages/SettingsPage', () => {
  const { View } = require('react-native');
  return () => <View testID="SettingsPage" />;
});
jest.mock('../../pages/CommunityReport', () => {
  const { View } = require('react-native');
  return () => <View testID="CommunityReport" />;
});
jest.mock('../../pages/Telemedicine', () => {
  const { View } = require('react-native');
  return () => <View testID="Telemedicine" />;
});
jest.mock('../../pages/HygieneEducation', () => {
  const { View } = require('react-native');
  return () => <View testID="HygieneEducation" />;
});

jest.mock('../HeroSection', () => {
  const { View } = require('react-native');
  return () => <View testID="HeroSection" />;
});
jest.mock('../Card', () => {
  const { View } = require('react-native');
  return () => <View testID="Card" />;
});
jest.mock('../RegionFilter', () => {
  const { View } = require('react-native');
  return () => <View testID="RegionFilter" />;
});
jest.mock('../TrendChart', () => {
  const { View } = require('react-native');
  return () => <View testID="TrendChart" />;
});
jest.mock('../RiskHeatmap', () => {
  const { View } = require('react-native');
  return () => <View testID="RiskHeatmap" />;
});
jest.mock('../AlertHistoryPanel', () => {
  const { View } = require('react-native');
  return () => <View testID="AlertHistoryPanel" />;
});
jest.mock('../ExplainabilityPanel', () => {
  const { View } = require('react-native');
  return () => <View testID="ExplainabilityPanel" />;
});
jest.mock('../RiskAnalysisPanel', () => {
  const { View } = require('react-native');
  return () => <View testID="RiskAnalysisPanel" />;
});
jest.mock('../SelfAssessment', () => {
  const { View } = require('react-native');
  return () => <View testID="SelfAssessment" />;
});
jest.mock('../ProximityStats', () => {
  const { View } = require('react-native');
  return () => <View testID="ProximityStats" />;
});
jest.mock('../CategorizedMap', () => {
  const { View } = require('react-native');
  return () => <View testID="CategorizedMap" />;
});
jest.mock('../EmergencyHelpline', () => {
  const { View } = require('react-native');
  return () => <View testID="EmergencyHelpline" />;
});
jest.mock('../TestingLabs', () => {
  const { View } = require('react-native');
  return () => <View testID="TestingLabs" />;
});
jest.mock('../AdvisoriesPanel', () => {
  const { View } = require('react-native');
  return () => <View testID="AdvisoriesPanel" />;
});
jest.mock('../HealthCertificate', () => {
  const { View } = require('react-native');
  return () => <View testID="HealthCertificate" />;
});
jest.mock('../FieldWorkerLogistics', () => {
  const { View } = require('react-native');
  return () => <View testID="FieldWorkerLogistics" />;
});

const mockColors: Theme = {
  background: '#000',
  surface: '#000',
  surfaceLevel2: '#000',
  surfaceVariant: '#000',
  surfaceElevated: '#000',
  text: '#000',
  textSecondary: '#000',
  textTertiary: '#000',
  primary: '#000',
  primaryLight: '#000',
  primaryVariant: '#000',
  secondary: '#000',
  accent: '#000',
  success: '#000',
  successLight: '#000',
  warning: '#000',
  warningLight: '#000',
  error: '#000',
  errorLight: '#000',
  border: '#000',
  borderLight: '#000',
  shadow: '#000',
  disabled: '#000',
  glass: '#000',
  glassLight: '#000',
  glassBorder: '#000',
  glassShadow: '#000',
  overlay: '#000',
  elevation: {
    low: '#000',
    medium: '#000',
    high: '#000',
  },
  alert: '#000',
  campaign: '#000',
};

const mockStyles = {
  content: {},
  screenHeader: {},
  screenTitle: {},
  screenSubtitle: {},
  section: {},
  geoAlert: {},
  geoAlertTitle: {},
  geoAlertText: {},
  sectionTitle: {},
  quickActionsGrid: {},
  quickActionItem: {},
  quickActionLabel: {},
  cardGap: {},
  emptyState: {},
  emptyStateIcon: {},
  emptyStateText: {},
  footer: {},
  footerText: {},
  footerSubtext: {},
};

const baseProps: ScreenRouterProps = {
  currentScreen: 'Dashboard',
  colors: mockColors,
  styles: mockStyles,
  handleNavigation: jest.fn(),
  handleAssessmentComplete: jest.fn(),
  handleRegionSelect: jest.fn(),
  handleHygieneUpdate: jest.fn(),
  userLocation: 'Test Location',
  userName: 'Test User',
  userEmail: 'test@example.com',
  userId: '1',
  userRiskLevel: 'low',
  onLogout: jest.fn(),
  geoAlertVisible: false,
  setGeoAlertVisible: jest.fn(),
  selectedRegion: 'all',
  regions: [],
  filteredOutbreaks: [],
  preventionCampaigns: [],
  filteredWaterAlerts: [],
  predictionInsights: [],
  alerts: [],
  diseaseTrendData: [],
  waterQualityTrendData: [],
  hygieneModules: [],
  hygieneScore: 0,
};

describe('ScreenRouter', () => {
  it('renders Dashboard as default', () => {
    render(<ScreenRouter {...baseProps} currentScreen="Dashboard" />);
    expect(screen.getByText('Quick Services')).toBeTruthy();
  });

  it('renders NationalStats when screen is NationalStats', () => {
    render(<ScreenRouter {...baseProps} currentScreen="NationalStats" />);
    // Since NationalStats is mocked as a string, it will render a component named 'NationalStats'
    expect(screen.getByTestId('NationalStats')).toBeTruthy();
  });

  it('renders Settings when screen is Settings', () => {
    render(<ScreenRouter {...baseProps} currentScreen="Settings" />);
    expect(screen.getByTestId('SettingsPage')).toBeTruthy();
  });

  it('renders TestingLabs and its header', () => {
    render(<ScreenRouter {...baseProps} currentScreen="TestingLabs" />);
    expect(screen.getByText('Approved Testing Labs')).toBeTruthy();
    expect(screen.getByTestId('TestingLabs')).toBeTruthy();
  });
});
