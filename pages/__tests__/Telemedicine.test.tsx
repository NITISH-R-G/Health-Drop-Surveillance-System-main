import React from 'react';
import { render } from '@testing-library/react-native';
import Telemedicine from '../Telemedicine';
import { ThemeProvider } from '../../lib/ThemeContext';
import { useSyncData } from '../../lib/sync';
import { doctors } from '../../lib/mockData';

// Mock the sync module
jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

describe('Telemedicine Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <Telemedicine onBack={jest.fn()} />
      </ThemeProvider>
    );
  };

  it('shows ActivityIndicator when loading', () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
    });

    const { getByTestId, queryByText } = renderComponent();

    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(queryByText(doctors[0].name)).toBeNull();
  });

  it('renders doctors list when data is loaded', () => {
    (useSyncData as jest.Mock).mockReturnValue({
      data: doctors,
      loading: false,
    });

    const { getByText } = renderComponent();

    // Verify first doctor is rendered
    expect(getByText('Dr. Anjali Gupta')).toBeTruthy();
    expect(getByText('General Physician • 8 years')).toBeTruthy();

    // Verify second doctor is rendered
    expect(getByText('Dr. Rajesh Kumar')).toBeTruthy();
  });
});
