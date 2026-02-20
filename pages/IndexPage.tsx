import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
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
import SettingsPage from './SettingsPage';
import NationalStats from './NationalStats';
// Aarogya Setu-inspired components
import SelfAssessment from '../components/SelfAssessment';
import HealthStatusBadge from '../components/HealthStatusBadge';
import ProximityStats from '../components/ProximityStats';
import HotspotMap from '../components/HotspotMap';
import EmergencyHelpline from '../components/EmergencyHelpline';
import TestingLabs from '../components/TestingLabs';
import AdvisoriesPanel from '../components/AdvisoriesPanel';
import HealthCertificate from '../components/HealthCertificate';
import {
  regions,
  outbreaks,
  waterQualityAlerts,
  preventionCampaigns,
  diseaseTrendData,
  waterQualityTrendData,
  alerts,
  predictionInsights,
  filterByRegion,
} from '../lib/mockData';

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
  userId = '',
}) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>('Dashboard');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [userRiskLevel, setUserRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');

  const handleNavigation = useCallback((screen: string) => {
    setCurrentScreen(screen);
    setSidebarVisible(false);
  }, []);

  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
  }, []);

  const handleAssessmentComplete = useCallback((riskLevel: 'low' | 'moderate' | 'high' | 'critical') => {
    setUserRiskLevel(riskLevel);
  }, []);

  const filteredOutbreaks = useMemo(() => filterByRegion(outbreaks, selectedRegion), [selectedRegion]);
  const filteredWaterAlerts = useMemo(() => filterByRegion(waterQualityAlerts, selectedRegion), [selectedRegion]);
  const filteredAlerts = useMemo(() => filterByRegion(alerts, selectedRegion), [selectedRegion]);

  // Common wrapper for non-dashboard screens
  const renderScreenShell = (content: React.ReactNode) => (
    <View style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.surface} />
      <Navbar onMenuPress={() => setSidebarVisible(true)} userName={userName} />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} onNavigate={handleNavigation} isGuest={isGuest} />
      {content}
    </View>
  );

  // === Self-Assessment ===
  if (currentScreen === 'SelfAssessment') {
    return renderScreenShell(
      <SelfAssessment
        onComplete={handleAssessmentComplete}
        onClose={() => handleNavigation('Dashboard')}
      />
    );
  }

  // === National Statistics ===
  if (currentScreen === 'NationalStats') {
    return renderScreenShell(
      <NationalStats onNavigate={handleNavigation} />
    );
  }

  // === Hotspot Map (full screen) ===
  if (currentScreen === 'HotspotMap') {
    return renderScreenShell(
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Contamination Hotspots</Text>
        </View>
        <View style={styles.section}>
          <HotspotMap />
        </View>
      </ScrollView>
    );
  }

  // === Testing Labs ===
  if (currentScreen === 'TestingLabs') {
    return renderScreenShell(
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Approved Testing Labs</Text>
          <Text style={styles.screenSubtitle}>Water testing & pathology facilities near you</Text>
        </View>
        <View style={styles.section}>
          <TestingLabs />
        </View>
      </ScrollView>
    );
  }

  // === Emergency Helpline ===
  if (currentScreen === 'Helpline') {
    return renderScreenShell(
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Emergency Helpline</Text>
        </View>
        <View style={styles.section}>
          <EmergencyHelpline onClose={() => handleNavigation('Dashboard')} />
        </View>
      </ScrollView>
    );
  }

  // === Health Certificate ===
  if (currentScreen === 'HealthCertificate') {
    return renderScreenShell(
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Health Certificate</Text>
        </View>
        <View style={styles.section}>
          <HealthCertificate
            userName={userName}
            riskLevel={userRiskLevel}
            location="New Delhi, India"
          />
        </View>
      </ScrollView>
    );
  }

  // === Settings ===
  if (currentScreen === 'Settings') {
    return renderScreenShell(
      <SettingsPage onNavigate={handleNavigation} userId={userId} userEmail={userEmail} />
    );
  }

  // === Main Dashboard ===
  return (
    <View style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.surface} />
      <Navbar onMenuPress={() => setSidebarVisible(true)} userName={userName} />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} onNavigate={handleNavigation} isGuest={isGuest} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Alert Banner */}
        <AlertBanner alerts={filteredAlerts} />

        {/* Health Status Badge (Aarogya Setu-style) */}
        <HealthStatusBadge riskLevel={userRiskLevel} lastAssessed="Just now" />

        {/* Self-Assessment CTA */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => handleNavigation('SelfAssessment')}
            activeOpacity={0.7}
          >
            <Ionicons name="clipboard" size={32} color={colors.primary} style={{ marginRight: 16 }} />
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Take Self-Assessment</Text>
              <Text style={styles.ctaSubtitle}>Check your water-borne disease risk</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <HeroSection userName={userName} selectedRegion={selectedRegion} />

        {/* Region Filter */}
        <RegionFilter regions={regions} selectedRegion={selectedRegion} onSelect={handleRegionSelect} />

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              { icon: 'stats-chart', label: 'Statistics', screen: 'NationalStats' },
              { icon: 'map', label: 'Hotspots', screen: 'HotspotMap' },
              { icon: 'flask', label: 'Labs', screen: 'TestingLabs' },
              { icon: 'warning', label: 'Helpline', screen: 'Helpline' },
              { icon: 'document-text', label: 'Certificate', screen: 'HealthCertificate' },
              { icon: 'settings', label: 'Settings', screen: 'Settings' },
            ].map((action) => (
              <TouchableOpacity
                key={action.screen}
                style={{ width: '31%', marginBottom: spacing.sm }}
                onPress={() => handleNavigation(action.screen)}
                activeOpacity={0.7}
              >
                <BlurView
                  intensity={80}
                  tint={theme === 'dark' ? 'dark' : 'light'}
                  style={styles.quickActionItem}
                >
                  <Ionicons name={action.icon as any} size={28} color={colors.primary} style={{ marginBottom: 8 }} />
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Proximity Stats (Aarogya Setu-style) */}
        <View style={styles.section}>
          <ProximityStats />
        </View>

        {/* Section: Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trends Overview</Text>
          <View style={styles.cardGap}>
            <TrendChart data={diseaseTrendData} title="Disease Cases" subtitle="Monthly reported cases" color={colors.error} unit=" cases" />
          </View>
          <View style={styles.cardGap}>
            <TrendChart data={waterQualityTrendData} title="Water Quality Index" subtitle="Average safety score" color={colors.primary} unit="%" />
          </View>
        </View>

        {/* Section: Active Outbreaks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Outbreaks</Text>
          {filteredOutbreaks.length > 0 ? (
            filteredOutbreaks.map((item) => (
              <Card key={item.id} title={item.title} date={item.date} description={item.description} location={item.location} type={item.type} severity={item.severity} caseCount={item.caseCount} onPress={() => { }} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>✓</Text>
              <Text style={styles.emptyStateText}>No active outbreaks in this region</Text>
            </View>
          )}
        </View>

        {/* Section: Water Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Quality Alerts</Text>
          {filteredWaterAlerts.length > 0 ? (
            filteredWaterAlerts.map((item) => (
              <Card key={item.id} title={item.title} date={item.date} description={item.description} location={item.location} type={item.type} severity={item.severity} onPress={() => { }} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💧</Text>
              <Text style={styles.emptyStateText}>All water sources are safe in this region</Text>
            </View>
          )}
        </View>

        {/* Section: Hotspot Map Preview */}
        <View style={styles.section}>
          <HotspotMap onZonePress={() => handleNavigation('HotspotMap')} />
        </View>

        {/* Section: Advisories (Aarogya Setu-style) */}
        <View style={styles.section}>
          <AdvisoriesPanel />
        </View>

        {/* Section: Risk Heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regional Risk Map</Text>
          <RiskHeatmap selectedRegion={selectedRegion} />
        </View>

        {/* Section: AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Predictions</Text>
          <Text style={styles.sectionSubtitle}>Transparent outbreak probability analysis</Text>
          {predictionInsights.map((insight) => (
            <View key={insight.id} style={styles.cardGap}>
              <ExplainabilityPanel insight={insight} />
            </View>
          ))}
        </View>

        {/* Section: Alert History */}
        <View style={styles.section}>
          <AlertHistoryPanel alerts={alerts} maxItems={5} />
        </View>

        {/* Section: Prevention Campaigns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prevention Campaigns</Text>
          {preventionCampaigns.map((item) => (
            <Card key={item.id} title={item.title} date={item.date} description={item.description} location={item.location} type={item.type} severity={item.severity} onPress={() => { }} />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>HealthDrop Surveillance System</Text>
          <Text style={styles.footerSubtext}>Powered by AI · Real-time Monitoring</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent' },
    content: { flex: 1 },
    section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
    sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.sm },
    sectionSubtitle: { ...typography.caption1, color: colors.textSecondary, marginBottom: spacing.lg },
    cardGap: { marginBottom: spacing.md },
    // Screen headers for sub-pages
    screenHeader: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingTop: spacing.xl },
    backText: { ...typography.callout, color: colors.primary, fontWeight: '500', marginBottom: spacing.sm },
    screenTitle: { ...typography.largeTitle, color: colors.text },
    screenSubtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },
    // Self-Assessment CTA
    ctaContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
    ctaButton: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.glass,
      borderRadius: radius.xl, padding: spacing.lg,
      borderWidth: 1, borderColor: colors.glassBorder,
    },
    ctaIcon: { fontSize: 28, marginRight: spacing.md },
    ctaContent: { flex: 1 },
    ctaTitle: { ...typography.headline, color: colors.primary },
    ctaSubtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 1 },
    ctaArrow: { fontSize: 24, color: colors.primary, fontWeight: '300' },
    // Quick Actions
    quickActionsGrid: {
      flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    },
    quickActionItem: {
      borderRadius: radius.xl, padding: spacing.lg, alignItems: 'center',
      borderWidth: 1, borderColor: colors.glassBorder,
      backgroundColor: colors.glass, overflow: 'hidden'
    },
    quickActionIcon: { fontSize: 24, marginBottom: spacing.xs },
    quickActionLabel: { ...typography.caption1, color: colors.textSecondary, fontWeight: '500', textAlign: 'center' },
    // Empty states
    emptyState: {
      backgroundColor: colors.glass, borderRadius: radius.xl, padding: spacing.xxl,
      alignItems: 'center', borderWidth: 1, borderColor: colors.glassBorder,
    },
    emptyStateIcon: { fontSize: 24, marginBottom: spacing.sm },
    emptyStateText: { ...typography.subhead, color: colors.textSecondary },
    // Footer
    footer: { alignItems: 'center', paddingVertical: spacing.xxxl, marginBottom: spacing.xl },
    footerText: { ...typography.footnote, color: colors.textTertiary, fontWeight: '600' },
    footerSubtext: { ...typography.caption2, color: colors.textTertiary, marginTop: 4 },
  });

export default IndexPageContent;