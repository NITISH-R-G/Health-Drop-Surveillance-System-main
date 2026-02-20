import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface NavbarProps {
  onMenuPress: () => void;
  userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuPress, userName }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.navbar}>
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

      <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(userName)}</Text>
        </View>
        <View style={styles.statusDot} />
      </TouchableOpacity>
    </BlurView>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 48 + spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.glass,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.glassBorder,
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