import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EmergencyHelpline from '../EmergencyHelpline';
import { ThemeProvider } from '../../lib/ThemeContext';
import { helplineContacts } from '../../lib/mockData';
import { Linking } from 'react-native';

// Mock the vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('EmergencyHelpline Component', () => {
  it('renders contacts grouped by category correctly', () => {
    const { getByText, getAllByText } = render(
      <ThemeProvider>
        <EmergencyHelpline contacts={helplineContacts} onClose={() => {}} />
      </ThemeProvider>
    );

    // Verify groups exist
    expect(getByText('Emergency Services')).toBeTruthy();
    expect(getByText('Health Services')).toBeTruthy();
    expect(getByText('Water & Sanitation')).toBeTruthy();
    expect(getByText('Government')).toBeTruthy();

    // Verify a specific contact exists
    expect(getByText('Emergency Ambulance')).toBeTruthy();
    expect(getByText('National ambulance service')).toBeTruthy();
    expect(getAllByText('24/7').length).toBeGreaterThan(0);
  });

  it('renders default empty state when no contacts provided', () => {
    const { queryByText } = render(
      <ThemeProvider>
        <EmergencyHelpline contacts={[]} onClose={() => {}} />
      </ThemeProvider>
    );

    expect(queryByText('Emergency Services')).toBeNull();
  });

  it('calls Linking.openURL when call button is pressed', () => {
    const openURLSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    const contacts = [helplineContacts[0]]; // Use only the first one to avoid finding multiple buttons

    const { getAllByText } = render(
      <ThemeProvider>
        <EmergencyHelpline contacts={contacts} onClose={() => {}} />
      </ThemeProvider>
    );

    const callButton = getAllByText(/108/)[1]; // One is in the SOS banner, one is the contact row
    fireEvent.press(callButton);

    expect(openURLSpy).toHaveBeenCalledWith('tel:108');
    openURLSpy.mockRestore();
  });
});
