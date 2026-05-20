import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../Card';
import { ThemeProvider } from '../../lib/ThemeContext';

describe('Card Component', () => {
  it('renders correctly with required props', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Card
          title="Test Title"
          date="2023-10-27"
          description="Test Description"
          type="outbreak"
          severity="medium"
          location="Test Location"
          onPress={() => {}}
        />
      </ThemeProvider>
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Oct 27')).toBeTruthy(); // The component formats the date string internally
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('MEDIUM')).toBeTruthy();
  });
});
