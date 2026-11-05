import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import SelfAssessment from '../SelfAssessment';

// Mock Expo vector icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: ({ testID, name, ...props }: any) => <View testID={testID || `mock-ionicons-${name}`} {...props} />,
  };
});

// Mock the ThemeContext
jest.mock('../../lib/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.8)',
      glassBorder: 'rgba(0, 0, 0, 0.1)',
      error: '#ff0000',
      warning: '#ffa500',
      primary: '#0000ff',
      text: '#000000',
      textSecondary: '#666666',
      surfaceVariant: '#e0e0e0',
    },
  }),
  typography: {
    headline: { fontSize: 20, fontWeight: '600' },
    footnote: { fontSize: 13 },
    caption1: { fontSize: 12 },
    title2: { fontSize: 22, fontWeight: '600' },
    callout: { fontSize: 16 },
    title1: { fontSize: 28, fontWeight: 'bold' },
    subhead: { fontSize: 15 },
    body: { fontSize: 17 },
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
  },
  radius: {
    lg: 12, xl: 16,
  },
}));

describe('SelfAssessment', () => {
  let mockOnClose: jest.Mock;
  let mockOnComplete: jest.Mock;
  let mockOpenURL: jest.SpyInstance;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnComplete = jest.fn();
    mockOpenURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders initially with the first question', () => {
    const { getByText } = render(<SelfAssessment onClose={mockOnClose} onComplete={mockOnComplete} />);

    expect(getByText('Self-Assessment')).toBeTruthy();
    expect(getByText('Question 1')).toBeTruthy();
    expect(getByText('Are you experiencing diarrhea or loose stools?')).toBeTruthy();
  });

  it('completes the assessment with low risk', () => {
    const { getByText } = render(<SelfAssessment onClose={mockOnClose} onComplete={mockOnComplete} />);

    // Q1
    fireEvent.press(getByText('No'));
    // Q2
    fireEvent.press(getByText('No'));
    // Q3
    fireEvent.press(getByText('No fever'));
    // Q4
    fireEvent.press(getByText('None'));
    // Q5
    fireEvent.press(getByText('Treated municipal/RO'));
    // Q6
    fireEvent.press(getByText('No'));
    // Q7
    fireEvent.press(getByText('No'));
    // Q8
    fireEvent.press(getByText('Good / Covered drainage'));

    expect(getByText('Assessment Result')).toBeTruthy();
    expect(getByText('Low Risk')).toBeTruthy();
    expect(getByText('Risk Score: 0/24')).toBeTruthy();
    expect(mockOnComplete).toHaveBeenCalledWith('low', 0);
  });

  it('completes the assessment with critical risk and interacts with links', () => {
    const { getByText, getByTestId } = render(<SelfAssessment onClose={mockOnClose} onComplete={mockOnComplete} />);

    // Q1
    fireEvent.press(getByText('Severe (3+ times/day)')); // 3
    // Q2
    fireEvent.press(getByText('Frequent')); // 2
    // Q3
    fireEvent.press(getByText('High fever (>38°C)')); // 3
    // Q4
    fireEvent.press(getByText('Dehydration signs')); // 3
    // Q5
    fireEvent.press(getByText('River/pond/untreated')); // 3
    // Q6
    fireEvent.press(getByText('Yes, significant flooding')); // 2
    // Q7
    fireEvent.press(getByText('Yes')); // 3
    // Q8
    fireEvent.press(getByText('Poor / Open drains nearby')); // 3

    // Score = 3 + 2 + 3 + 3 + 3 + 2 + 3 + 3 = 22
    expect(getByText('Assessment Result')).toBeTruthy();
    expect(getByText('Critical Risk')).toBeTruthy();
    // The component sums the values, checking if score is accurate
    expect(getByText('Risk Score: 22/24')).toBeTruthy();
    expect(mockOnComplete).toHaveBeenCalledWith('critical', 22);

    // Call Helpline
    fireEvent.press(getByText(/Call Helpline/i));
    expect(mockOpenURL).toHaveBeenCalledWith('tel:104');

    // Find Nearby Lab
    fireEvent.press(getByText(/Find Nearby Lab/i));
    expect(mockOpenURL).toHaveBeenCalledWith('https://www.google.com/maps/search/nearby+hospital+clinic+or+lab');
  });

  it('navigates back using the back button', () => {
    const { getByText, getByTestId } = render(<SelfAssessment onClose={mockOnClose} onComplete={mockOnComplete} />);

    // Q1
    fireEvent.press(getByText('Mild (1-2 times/day)'));

    // Q2
    expect(getByText('Question 2')).toBeTruthy();

    // Press back
    fireEvent.press(getByTestId('mock-ionicons-chevron-back'));

    // Back to Q1
    expect(getByText('Question 1')).toBeTruthy();
  });

  it('calls onClose when back is pressed on the first step', () => {
    const { getByTestId } = render(<SelfAssessment onClose={mockOnClose} onComplete={mockOnComplete} />);

    fireEvent.press(getByTestId('mock-ionicons-close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose from the results screen', () => {
    const { getByText, getByTestId } = render(<SelfAssessment onClose={mockOnClose} onComplete={mockOnComplete} />);

    // Go to end (low risk)
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('No fever'));
    fireEvent.press(getByText('None'));
    fireEvent.press(getByText('Treated municipal/RO'));
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('Good / Covered drainage'));

    expect(getByText('Assessment Result')).toBeTruthy();

    fireEvent.press(getByTestId('mock-ionicons-close'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('retakes the assessment from the results screen', () => {
    const { getByText } = render(<SelfAssessment onClose={mockOnClose} onComplete={mockOnComplete} />);

    // Go to end
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('No fever'));
    fireEvent.press(getByText('None'));
    fireEvent.press(getByText('Treated municipal/RO'));
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('No'));
    fireEvent.press(getByText('Good / Covered drainage'));

    expect(getByText('Assessment Result')).toBeTruthy();

    // Retake
    fireEvent.press(getByText('Retake Assessment'));

    // Back to Q1
    expect(getByText('Self-Assessment')).toBeTruthy();
    expect(getByText('Question 1')).toBeTruthy();
  });
});
