import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Telemedicine from '../Telemedicine';
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
      surfaceVariant: '#eee',
    },
  }),
  typography: {
    title3: {},
    headline: {},
    caption1: {},
    caption2: {},
  },
  spacing: { md: 8, lg: 16, xl: 24 },
  radius: { lg: 8 },
}));

jest.mock('../../lib/sync', () => ({
  useSyncData: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('Telemedicine Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (useSyncData as jest.Mock).mockReturnValue({ data: null, loading: true });

    render(<Telemedicine onBack={mockOnBack} />);

    expect(screen.getByText('Feeling Unwell?')).toBeTruthy();
  });

  it('renders a list of doctors from sync data', () => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Test One', spec: 'Cardiologist', exp: '10 years', online: true },
      { id: 2, name: 'Dr. Test Two', spec: 'Neurologist', exp: '15 years', online: false },
    ];
    (useSyncData as jest.Mock).mockReturnValue({ data: mockDoctors, loading: false });

    render(<Telemedicine onBack={mockOnBack} />);

    expect(screen.getByText('Dr. Test One')).toBeTruthy();
    expect(screen.getByText('Dr. Test Two')).toBeTruthy();
    expect(screen.getByText('Cardiologist • 10 years')).toBeTruthy();
  });
});
