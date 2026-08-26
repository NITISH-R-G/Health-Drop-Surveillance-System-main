import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CommunityReport from '../CommunityReport';
import { useSyncData } from '../../lib/sync';

// Mock the dependencies
jest.mock('../../lib/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#000',
      background: '#fff',
      text: '#000',
      textSecondary: '#666',
      surface: '#fff',
      success: '#0f0',
      border: '#ccc',
      error: '#f00',
      textTertiary: '#999',
    },
  }),
  typography: {
    title3: {},
    headline: {},
    caption1: {},
    caption2: {},
    subhead: {},
    body: {},
  },
  spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
  radius: { md: 4, lg: 8, xl: 12 },
}));

jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

describe('CommunityReport Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially for issue types', () => {
    (useSyncData as jest.Mock).mockReturnValue({ data: null, loading: true });

    render(<CommunityReport onBack={mockOnBack} />);

    expect(screen.getByText("What's the issue?")).toBeTruthy();
    expect(screen.getByText('Location')).toBeTruthy();
  });

  it('renders a list of issue types from sync data', () => {
    const mockIssueTypes = [
      { id: 'test_1', label: 'Test Issue 1', icon: 'water' },
      { id: 'test_2', label: 'Test Issue 2', icon: 'fire' },
    ];
    (useSyncData as jest.Mock).mockReturnValue({ data: mockIssueTypes, loading: false });

    render(<CommunityReport onBack={mockOnBack} />);

    expect(screen.getByText('Test Issue 1')).toBeTruthy();
    expect(screen.getByText('Test Issue 2')).toBeTruthy();
  });
});
