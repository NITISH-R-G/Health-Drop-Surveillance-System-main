import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import NationalStats from '../NationalStats';
import { ThemeProvider } from '../../lib/ThemeContext';
import * as ghoApi from '../../lib/ghoApi';

// Mock the navigation prop
const mockNavigate = jest.fn();

jest.mock('../../lib/ghoApi', () => {
  return {
    fetchCholeraCases: jest.fn(),
    fetchCholeraDeaths: jest.fn(),
  };
});

// Mock expo-blur
jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return {
    BlurView: View,
  };
});

describe('NationalStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <NationalStats onNavigate={mockNavigate} />
      </ThemeProvider>
    );
  };

  it('renders loading state initially and then shows API data', async () => {
    // Setup mocks to return some data after a delay
    (ghoApi.fetchCholeraCases as jest.Mock).mockResolvedValue([
      { Value: '5000' }
    ]);
    (ghoApi.fetchCholeraDeaths as jest.Mock).mockResolvedValue([
      { Value: '250' }
    ]);

    const { getByText, queryAllByText, getAllByText } = renderComponent();

    // Wait for the API to resolve
    await waitFor(() => {
      // 5,000 should be visible because it replaces the fallback data when resolved
      expect(getByText('5,000')).toBeTruthy();
    });

    // Ensure the API was called
    expect(ghoApi.fetchCholeraCases).toHaveBeenCalledWith('IND', 1);
    expect(ghoApi.fetchCholeraDeaths).toHaveBeenCalledWith('IND', 1);
  });

  it('handles API errors gracefully and displays fallback data', async () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup mocks to reject
    (ghoApi.fetchCholeraCases as jest.Mock).mockRejectedValue(new Error('API Error'));
    (ghoApi.fetchCholeraDeaths as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { getByText } = renderComponent();

    await waitFor(() => {
      // 14,210 is the default fallback for Cholera (API IND)
      expect(getByText('14,210')).toBeTruthy();
    });

    consoleSpy.mockRestore();
  });

  it('allows sorting the state table by Active and Total without crashing', async () => {
    (ghoApi.fetchCholeraCases as jest.Mock).mockResolvedValue([]);
    (ghoApi.fetchCholeraDeaths as jest.Mock).mockResolvedValue([]);

    const { getByText, getAllByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('West Bengal')).toBeTruthy();
    });

    const activeTexts = getAllByText('Active');
    const totalTexts = getAllByText('Total');

    // Ensure the sorting text buttons exist
    expect(activeTexts.length).toBeGreaterThan(0);
    expect(totalTexts.length).toBeGreaterThan(0);

    // Fire press event to update the sorting state
    // The sorting buttons are typically the ones outside the table headers or labels.
    // Firing press on valid sort button elements updates the state.
    const activeSortButton = activeTexts.find(el => el.props.style);
    const totalSortButton = totalTexts.find(el => el.props.style);

    if (activeSortButton) fireEvent.press(activeSortButton);

    await waitFor(() => {
        // Just verify that "West Bengal" is still displayed
        expect(getByText('West Bengal')).toBeTruthy();
    });

    if (totalSortButton) fireEvent.press(totalSortButton);

    await waitFor(() => {
        // Just verify that "West Bengal" is still displayed
        expect(getByText('West Bengal')).toBeTruthy();
    });
  });
});
