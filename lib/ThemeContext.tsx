import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Theme {
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  primaryVariant: string;
  secondary: string;
  accent: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  border: string;
  borderLight: string;
  shadow: string;
  disabled: string;
  glass: string;
  glassLight: string;
  glassBorder: string;
  glassShadow: string;
  overlay: string;
  elevation: {
    low: string;
    medium: string;
    high: string;
  };
  alert: string;
  campaign: string;
}

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37 },
  title1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: 0.36 },
  title2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.35 },
  title3: { fontSize: 20, fontWeight: '600' as const, letterSpacing: 0.38 },
  headline: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.41 },
  body: { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.41 },
  callout: { fontSize: 16, fontWeight: '400' as const, letterSpacing: -0.32 },
  subhead: { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.24 },
  footnote: { fontSize: 13, fontWeight: '400' as const, letterSpacing: -0.08 },
  caption1: { fontSize: 12, fontWeight: '400' as const, letterSpacing: 0 },
  caption2: { fontSize: 11, fontWeight: '400' as const, letterSpacing: 0.07 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const themes = {
  light: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
    surfaceElevated: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#636366',
    textTertiary: '#AEAEB2',
    primary: '#007AFF',
    primaryLight: '#007AFF18',
    primaryVariant: '#0056B3',
    secondary: '#34C759',
    accent: '#5856D6',
    success: '#34C759',
    successLight: '#34C75918',
    warning: '#FF9500',
    warningLight: '#FF950018',
    error: '#FF3B30',
    errorLight: '#FF3B3018',
    border: '#E5E5EA',
    borderLight: '#F2F2F7',
    shadow: '#00000010',
    disabled: '#C7C7CC',
    glass: 'rgba(255, 255, 255, 0.72)',
    glassLight: 'rgba(255, 255, 255, 0.52)',
    glassBorder: 'rgba(255, 255, 255, 0.48)',
    glassShadow: 'rgba(0, 0, 0, 0.06)',
    overlay: 'rgba(0, 0, 0, 0.32)',
    elevation: {
      low: 'rgba(0, 0, 0, 0.04)',
      medium: 'rgba(0, 0, 0, 0.08)',
      high: 'rgba(0, 0, 0, 0.14)',
    },
    alert: '#FF3B30',
    campaign: '#34C759',
  } as Theme,
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    surfaceElevated: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#636366',
    primary: '#0A84FF',
    primaryLight: '#0A84FF20',
    primaryVariant: '#409CFF',
    secondary: '#30D158',
    accent: '#5E5CE6',
    success: '#30D158',
    successLight: '#30D15820',
    warning: '#FF9F0A',
    warningLight: '#FF9F0A20',
    error: '#FF453A',
    errorLight: '#FF453A20',
    border: '#38383A',
    borderLight: '#2C2C2E',
    shadow: '#00000030',
    disabled: '#48484A',
    glass: 'rgba(28, 28, 30, 0.72)',
    glassLight: 'rgba(44, 44, 46, 0.52)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassShadow: 'rgba(0, 0, 0, 0.20)',
    overlay: 'rgba(0, 0, 0, 0.56)',
    elevation: {
      low: 'rgba(255, 255, 255, 0.04)',
      medium: 'rgba(255, 255, 255, 0.08)',
      high: 'rgba(255, 255, 255, 0.14)',
    },
    alert: '#FF453A',
    campaign: '#30D158',
  } as Theme,
};

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value: ThemeContextType = {
    theme,
    colors: themes[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};