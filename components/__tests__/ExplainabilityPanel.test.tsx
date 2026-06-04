import React from 'react';
import { render } from '@testing-library/react-native';
import ExplainabilityPanel from '../ExplainabilityPanel';
import { ThemeProvider } from '../../lib/ThemeContext';
import { PredictionInsight } from '../../types/models';

const mockInsight: PredictionInsight = {
  id: 1,
  region: 'Test Region',
  disease: 'Test Disease',
  probability: 0.85,
  timeframe: 'Next 14 days',
  confidence: 0.9,
  factors: [
    { name: 'Factor A', impact: 0.4, direction: 'up' },
    { name: 'Factor B', impact: 0.2, direction: 'down' },
  ],
  reasoning: 'This is a test reasoning string for the insight.',
};

describe('ExplainabilityPanel', () => {
  it('renders null when no insight is provided', () => {
    const { toJSON } = render(
      <ThemeProvider>
        <ExplainabilityPanel />
      </ThemeProvider>
    );
    expect(toJSON()).toBeNull();
  });

  it('renders dynamically provided insight data', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ExplainabilityPanel insight={mockInsight} />
      </ThemeProvider>
    );

    // Header assertions
    expect(getByText('Test Disease Advisory')).toBeTruthy();
    expect(getByText('Test Region Analysis')).toBeTruthy();
    expect(getByText('Severe Risk')).toBeTruthy(); // probability 0.85 >= 0.70
    expect(getByText('Next 14 days')).toBeTruthy();

    // Reasoning assertion
    expect(getByText('This is a test reasoning string for the insight.')).toBeTruthy();

    // Factors assertions
    expect(getByText('Factor A')).toBeTruthy();
    expect(getByText('Impact: 40% (UP)')).toBeTruthy();

    expect(getByText('Factor B')).toBeTruthy();
    expect(getByText('Impact: 20% (DOWN)')).toBeTruthy();
  });
});
