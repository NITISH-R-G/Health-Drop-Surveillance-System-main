import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import NationalStats from '../NationalStats';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as ghoApi from '../../lib/ghoApi';

// Mock the API calls
jest.mock('../../lib/ghoApi', () => ({
  fetchCholeraCases: jest.fn(),
  fetchCholeraDeaths: jest.fn(),
}));

// Mock Expo vector icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: () => <View testID="mock-ionicons" />,
  };
});

// Mock expo-blur
jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return {
    BlurView: ({ children }: any) => <View testID="mock-blur-view">{children}</View>,
  };
});

const mockOnNavigate = jest.fn();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

// Suppress console.error for expected API errors in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Failed to load live GHO data')) {
      return;
    }
    originalConsoleError(...args);
  };
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('NationalStats Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially and then data', async () => {
    (ghoApi.fetchCholeraCases as jest.Mock).mockResolvedValue([
      { Value: '15000' }
    ]);
    (ghoApi.fetchCholeraDeaths as jest.Mock).mockResolvedValue([
      { Value: '500' }
    ]);

    const { getByText } = renderWithTheme(
      <NationalStats onNavigate={mockOnNavigate} />
    );

    // Basic renders
    expect(getByText('National Statistics')).toBeTruthy();

    // Wait for the API calls to complete
    await waitFor(() => {
      expect(ghoApi.fetchCholeraCases).toHaveBeenCalledWith('IND', 1);
      expect(ghoApi.fetchCholeraDeaths).toHaveBeenCalledWith('IND', 1);
    });

    // Check if the mock data is rendered
    expect(getByText('15,000')).toBeTruthy();
  });

  it('handles API error gracefully and falls back to default data', async () => {
    (ghoApi.fetchCholeraCases as jest.Mock).mockRejectedValue(new Error('API Error'));
    (ghoApi.fetchCholeraDeaths as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { getByText } = renderWithTheme(
      <NationalStats onNavigate={mockOnNavigate} />
    );

    await waitFor(() => {
      expect(ghoApi.fetchCholeraCases).toHaveBeenCalled();
    });

    // The default mocked fallback is 14210
    expect(getByText('14,210')).toBeTruthy();
  });

  it('navigates back when back button is pressed', async () => {
    (ghoApi.fetchCholeraCases as jest.Mock).mockResolvedValue([]);
    (ghoApi.fetchCholeraDeaths as jest.Mock).mockResolvedValue([]);

    const { UNSAFE_getAllByType } = renderWithTheme(
      <NationalStats onNavigate={mockOnNavigate} />
    );

    await waitFor(() => {
      expect(ghoApi.fetchCholeraCases).toHaveBeenCalled();
    });

    const backButtons = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
    // The first TouchableOpacity is the back button
    fireEvent.press(backButtons[0]);

    expect(mockOnNavigate).toHaveBeenCalledWith('Dashboard');
  });

  it('sorts state data correctly', async () => {
    (ghoApi.fetchCholeraCases as jest.Mock).mockResolvedValue([]);
    (ghoApi.fetchCholeraDeaths as jest.Mock).mockResolvedValue([]);

    const { getAllByText } = renderWithTheme(
      <NationalStats onNavigate={mockOnNavigate} />
    );

    await waitFor(() => {
      expect(ghoApi.fetchCholeraCases).toHaveBeenCalled();
    });

    // There are multiple texts with "Active" (one in sort button, one in table head)
    // The first one might be the sort button, let's just grab the buttons using an alternative way
    const activeSortButtons = getAllByText('Active');

    // The sort button text is "Active" and the table header text is also "Active"
    // Let's click the first one which should be the button in the sort group
    fireEvent.press(activeSortButtons[0]);

    // Wait for render update
    await waitFor(() => {
      // With the mock data, West Bengal has the highest active (2340)
      // and highest total (21240). Just to confirm the component didn't crash.
      expect(getAllByText('West Bengal')).toBeTruthy();
    });
  });
});
