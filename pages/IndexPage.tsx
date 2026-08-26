import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import Card from '../components/Card';
import RegionFilter from '../components/RegionFilter';
import TrendChart from '../components/TrendChart';
import RiskHeatmap from '../components/RiskHeatmap';
import AlertBanner from '../components/AlertBanner';
import AlertHistoryPanel from '../components/AlertHistoryPanel';
import ExplainabilityPanel from '../components/ExplainabilityPanel';
import RiskAnalysisPanel from '../components/RiskAnalysisPanel';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import NationalStats from './NationalStats';
import CommunityReport from './CommunityReport';
import Telemedicine from './Telemedicine';
import HygieneEducation from './HygieneEducation';
// Aarogya Setu-inspired components
import ScreenRouter from '../components/ScreenRouter';
import { filterByRegion } from '../lib/utils';
import { useSyncData } from '../lib/sync';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IndexPageProps {
  userEmail?: string;
  userName?: string;
  onLogout?: () => void;
  isGuest?: boolean;
  userId?: string;
}

const IndexPageContent: React.FC<IndexPageProps> = ({
  userEmail = '',
  userName = 'Health Worker',
  onLogout,
  isGuest = false,
  userId,
}) => {
  const { theme, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>('Dashboard');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [userRiskLevel, setUserRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>(
    'low'
  );
  const [geoAlertVisible, setGeoAlertVisible] = useState(true);
  const [userLocation, setUserLocation] = useState<string>('Locating...');

  // Persistent State for Hygiene Education
  const { data: hygieneScore, setData: setHygieneScore } = useSyncData('hygieneScore');
  const { data: hygieneModules, setData: setHygieneModules } = useSyncData('hygieneModules');

  const { data: regions } = useSyncData('regions');
  const { data: outbreaks } = useSyncData('outbreaks');
  const { data: waterQualityAlerts } = useSyncData('waterQualityAlerts');
  const { data: diseaseTrendData } = useSyncData('diseaseTrendData');
  const { data: waterQualityTrendData } = useSyncData('waterQualityTrendData');
  const { data: predictionInsights } = useSyncData('predictionInsights');
  const { data: preventionCampaigns } = useSyncData('preventionCampaigns');
  const { data: alerts } = useSyncData('alerts');

  useEffect(() => {
    setTimeout(() => {
      setUserLocation('Gandhipuram, Coimbatore');
    }, 2000);
  }, []);

  const handleNavigation = useCallback((screen: string) => {
    setCurrentScreen(screen);
    setSidebarVisible(false);
  }, []);

  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
  }, []);

  const handleAssessmentComplete = useCallback(
    (riskLevel: 'low' | 'moderate' | 'high' | 'critical') => {
      setUserRiskLevel(riskLevel);
    },
    []
  );

  const handleHygieneUpdate = useCallback(
    (id: number, points: number) => {
      setHygieneScore((prev: number) => prev + points);
      setHygieneModules((prev: any[]) =>
        prev.map((m) => (m.id === id ? { ...m, completed: true } : m))
      );
    },
    [setHygieneScore, setHygieneModules]
  );

  const filteredOutbreaks = useMemo(
    () => filterByRegion(outbreaks, selectedRegion),
    [selectedRegion]
  );
  const filteredWaterAlerts = useMemo(
    () => filterByRegion(waterQualityAlerts, selectedRegion),
    [selectedRegion]
  );
  const filteredAlerts = useMemo(() => filterByRegion(alerts, selectedRegion), [selectedRegion]);

  return (
    <View style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.surface} />
      <Navbar
        onMenuPress={() => setSidebarVisible(true)}
        userName={userName}
        toggleTheme={toggleTheme}
        onNavigate={handleNavigation}
      />
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleNavigation}
        isGuest={isGuest}
        currentScreen={currentScreen}
      />

      <View style={styles.content}>
        <ScreenRouter
          currentScreen={currentScreen}
          colors={colors}
          styles={styles}
          handleNavigation={handleNavigation}
          handleAssessmentComplete={handleAssessmentComplete}
          handleRegionSelect={handleRegionSelect}
          handleHygieneUpdate={handleHygieneUpdate}
          userLocation={userLocation}
          userName={userName}
          userEmail={userEmail}
          userId={userId}
          userRiskLevel={userRiskLevel}
          onLogout={onLogout}
          geoAlertVisible={geoAlertVisible}
          setGeoAlertVisible={setGeoAlertVisible}
          selectedRegion={selectedRegion}
          regions={regions}
          filteredOutbreaks={filteredOutbreaks}
          preventionCampaigns={preventionCampaigns}
          filteredWaterAlerts={filteredWaterAlerts}
          predictionInsights={predictionInsights}
          alerts={alerts}
          diseaseTrendData={diseaseTrendData}
          waterQualityTrendData={waterQualityTrendData}
          hygieneModules={hygieneModules}
          hygieneScore={hygieneScore}
        />
      </View>

      {/* Floating Bottom Nav */}
      <View style={styles.floatingNavWrapper}>
        <View style={styles.floatingNavContainer}>
          {[
            { id: 'Outbreaks', icon: 'bug', color: colors.error },
            { id: 'WaterQuality', icon: 'water', color: colors.primary },
            { id: 'Dashboard', icon: 'home', color: colors.text },
            { id: 'NationalStats', icon: 'stats-chart', color: colors.success },
            { id: 'HotspotMap', icon: 'map', color: colors.secondary },
            { id: 'SelfAssessment', icon: 'clipboard', color: colors.primary },
          ].map((item) => {
            const isActive =
              currentScreen === item.id ||
              (item.id === 'Dashboard' &&
                ![
                  'Outbreaks',
                  'WaterQuality',
                  'HotspotMap',
                  'SelfAssessment',
                  'NationalStats',
                ].includes(currentScreen));

            const activeIconColor =
              item.id === 'Dashboard' && theme === 'dark' ? colors.background : '#fff';

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.navPill, isActive && { backgroundColor: item.color }]}
                onPress={() => handleNavigation(item.id)}
                activeOpacity={0.8}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={isActive ? activeIconColor : colors.textSecondary}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: Theme, insets: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
    section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
    sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.sm },
    sectionSubtitle: {
      ...typography.caption1,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
    },
    cardGap: { marginBottom: spacing.md },
    screenHeader: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      paddingTop: Math.max(insets?.top || 0, spacing.xl),
    },
    backText: {
      ...typography.callout,
      color: colors.primary,
      fontWeight: '500',
      marginBottom: spacing.sm,
    },
    screenTitle: { ...typography.largeTitle, color: colors.text },
    screenSubtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },

    // Category Grid
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.xs,
    },
    categoryIconBg: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    categoryTitle: { ...typography.headline, marginBottom: 2 },
    categorySubtitle: { ...typography.caption2, color: colors.textSecondary },

    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    quickActionItem: {
      width: '31%',
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickActionIcon: { fontSize: 24, marginBottom: spacing.xs },
    quickActionLabel: {
      ...typography.caption1,
      color: colors.textSecondary,
      fontWeight: '500',
      textAlign: 'center',
    },
    geoAlert: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.error,
      margin: spacing.lg,
      marginBottom: 0,
      padding: spacing.md,
      borderRadius: radius.lg,
    },
    geoAlertTitle: { ...typography.headline, color: '#fff', fontSize: 14 },
    geoAlertText: { ...typography.caption2, color: '#fff', opacity: 0.9 },
    emptyState: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.xxl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyStateIcon: { fontSize: 24, marginBottom: spacing.sm },
    emptyStateText: { ...typography.subhead, color: colors.textSecondary },
    footer: { alignItems: 'center', paddingVertical: spacing.xxxl, marginBottom: spacing.xl },
    footerText: { ...typography.footnote, color: colors.textTertiary, fontWeight: '600' },
    footerSubtext: { ...typography.caption2, color: colors.textTertiary, marginTop: 4 },

    // Floating Nav Styles
    floatingNavWrapper: {
      position: 'absolute',
      bottom: spacing.xl,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    floatingNavContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 40,
      padding: 6,
      gap: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    navPill: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default IndexPageContent;
