import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { ThemeProvider, useTheme } from './lib/ThemeContext';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import IndexPage from './pages/IndexPage';
import { Profile } from './types/profile';

const { width, height } = Dimensions.get('window');

function AppContent() {
  const { colors, theme } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dynamic ambient background mesh for Liquid Glass depth */}
      <View style={{ position: 'absolute', top: -height * 0.1, right: -width * 0.2, width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: theme === 'dark' ? 'rgba(41, 151, 255, 0.25)' : 'rgba(0, 102, 204, 0.12)' }} />
      <View style={{ position: 'absolute', bottom: -height * 0.1, left: -width * 0.2, width: width, height: width, borderRadius: width * 0.5, backgroundColor: theme === 'dark' ? 'rgba(48, 209, 88, 0.2)' : 'rgba(52, 199, 89, 0.15)' }} />
      <View style={{ position: 'absolute', top: height * 0.3, left: width * 0.2, width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25, backgroundColor: theme === 'dark' ? 'rgba(94, 92, 230, 0.15)' : 'rgba(94, 92, 230, 0.1)' }} />
      <BlurView intensity={100} tint={theme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
      <BlurView intensity={80} tint={theme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} pointerEvents="none" />

      <IndexPage
        userName={profile.full_name || session.user.email?.split('@')[0] || 'User'}
        userEmail={session.user.email || ''}
        userId={session.user.id}
      />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
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