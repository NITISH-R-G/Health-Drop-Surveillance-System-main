import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface NavbarProps {
  onMenuPress: () => void;
  userName: string;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuPress, userName, toggleTheme }) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleProfilePress = () => {
    if (Platform.OS === 'web') {
      window.alert('Profile Menu:\n\n- View Profile\n- Preferences\n- Sign Out');
    } else {
      Alert.alert(
        "Profile Menu",
        `Signed in as ${userName}`,
        [
          { text: "View Profile", onPress: () => console.log("Profile Pressed") },
          { text: "Preferences", onPress: () => console.log("Settings Pressed") },
          { text: "Sign Out", onPress: () => console.log("Logout Pressed"), style: "destructive" },
          { text: "Cancel", style: "cancel" }
        ]
      );
    }
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton} activeOpacity={0.7}>
          <View style={styles.menuIconContainer}>
            <View style={styles.menuLine} />
            <View style={[styles.menuLine, styles.menuLineShort]} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/app_logo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.brandText}>
            <Text style={styles.appName}>HealthDrop</Text>
            <Text style={styles.tagline}>Surveillance System</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8} onPress={handleProfilePress}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
          <View style={styles.statusDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  navbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginTop: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  menuIconContainer: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    backgroundColor: colors.text,
    borderRadius: 1,
  },
  menuLineShort: {
    width: '70%',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
    flex: 1,
  },
  logoContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  brandText: {
    marginLeft: spacing.md,
  },
  appName: {
    ...typography.headline,
    color: colors.text,
    letterSpacing: -0.3,
  },
  tagline: {
    ...typography.caption2,
    color: colors.textSecondary,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  themeToggle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.caption1,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});

export default React.memo(Navbar);