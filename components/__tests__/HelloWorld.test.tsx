import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import HelloWorld from '../HelloWorld';
import { supabase } from '../../lib/supabase';

// Mock the Supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

// Mock Alert to interact with it programmatically
jest.spyOn(Alert, 'alert');

describe('HelloWorld Component', () => {
  const userEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with user email', () => {
    const { getByText } = render(<HelloWorld userEmail={userEmail} />);

    expect(getByText('Hello World! 🌍')).toBeTruthy();
    expect(getByText('Welcome to Health Drop')).toBeTruthy();
    expect(getByText(`Logged in as: ${userEmail}`)).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  it('calls Alert.alert when logout button is pressed', () => {
    const { getByText } = render(<HelloWorld userEmail={userEmail} />);

    fireEvent.press(getByText('Logout'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Logout',
      'Are you sure you want to logout?',
      expect.any(Array)
    );
  });

  it('calls supabase.auth.signOut when logout is confirmed', async () => {
    const { getByText } = render(<HelloWorld userEmail={userEmail} />);

    fireEvent.press(getByText('Logout'));

    // The alert is called, we need to extract the 'Logout' button's onPress and call it
    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const buttons = alertCalls[0][2];
    const logoutButton = buttons.find((b: any) => b.text === 'Logout');

    expect(logoutButton).toBeDefined();

    // Simulate pressing the confirm logout button
    await logoutButton.onPress();

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  it('does not call supabase.auth.signOut when logout is cancelled', () => {
    const { getByText } = render(<HelloWorld userEmail={userEmail} />);

    fireEvent.press(getByText('Logout'));

    // The alert is called, we need to extract the 'Cancel' button's onPress and call it if it exists
    const alertCalls = (Alert.alert as jest.Mock).mock.calls;
    const buttons = alertCalls[0][2];
    const cancelButton = buttons.find((b: any) => b.text === 'Cancel');

    expect(cancelButton).toBeDefined();

    // Simulate pressing the cancel button (usually it doesn't have an onPress, or it's empty, but let's call it if it exists)
    if (cancelButton.onPress) {
      cancelButton.onPress();
    }

    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });
});
