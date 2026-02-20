import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './lib/ThemeContext';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import IndexPage from './pages/IndexPage';
import { Profile } from './types/profile';

function AppContent() {
  // Dummy session state
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleAuthSuccess = (dummyData?: any) => {
    const email = dummyData?.email || 'demo@healthdrop.app';
    const fullName = dummyData?.fullName || 'Demo Worker';
    const role = dummyData?.role || 'volunteer';
    const organization = dummyData?.organization || 'Health Dept';
    const location = dummyData?.location || 'New Delhi';

    setSession({ user: { id: 'dummy-user-id', email } });
    setProfile({
      id: 'dummy-user-id',
      full_name: fullName,
      role: role as any,
      organization: organization,
      location: location,
      created_at: new Date().toISOString(),
      is_active: true,
    });
  };

  const handleProfileComplete = () => {
    // No-op for dummy mode
  };

  if (!session) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Profile setup skipped for dummy mode if we auto-set profile
  if (!profile) {
    return (
      <ProfileSetup
        userId={session.user.id}
        onProfileComplete={handleProfileComplete}
      />
    );
  }

  return (
    <View style={styles.container}>
      <IndexPage
        userName={profile.full_name || session.user.email?.split('@')[0] || 'User'}
        userEmail={session.user.email || ''}
        userId={session.user.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});