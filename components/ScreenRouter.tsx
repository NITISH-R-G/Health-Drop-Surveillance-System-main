import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, typography, spacing, radius } from '../lib/ThemeContext';
import HeroSection from './HeroSection';
import Card from './Card';
import RegionFilter from './RegionFilter';
import TrendChart from './TrendChart';
import RiskHeatmap from './RiskHeatmap';
import AlertHistoryPanel from './AlertHistoryPanel';
import ExplainabilityPanel from './ExplainabilityPanel';
import RiskAnalysisPanel from './RiskAnalysisPanel';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NationalStats from '../pages/NationalStats';
import CommunityReport from '../pages/CommunityReport';
import Telemedicine from '../pages/Telemedicine';
import HygieneEducation from '../pages/HygieneEducation';
import SelfAssessment from './SelfAssessment';
import ProximityStats from './ProximityStats';
import CategorizedMap from './CategorizedMap';
import EmergencyHelpline from './EmergencyHelpline';
import TestingLabs from './TestingLabs';
import AdvisoriesPanel from './AdvisoriesPanel';
import HealthCertificate from './HealthCertificate';
import FieldWorkerLogistics from './FieldWorkerLogistics';

export interface ScreenRouterProps {
  currentScreen: string;
  colors: Theme;
  styles: any;
  handleNavigation: (screen: string) => void;
  handleAssessmentComplete: (riskLevel: 'low' | 'moderate' | 'high' | 'critical') => void;
  handleRegionSelect: (regionId: string) => void;
  handleHygieneUpdate: (id: number, points: number) => void;
  userLocation: string;
  userName: string;
  userEmail: string;
  userId?: string;
  userRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  onLogout?: () => void;
  geoAlertVisible: boolean;
  setGeoAlertVisible: (visible: boolean) => void;
  selectedRegion: string;
  regions: any[];
  filteredOutbreaks: any[];
  preventionCampaigns: any[];
  filteredWaterAlerts: any[];
  predictionInsights: any[];
  alerts: any[];
  diseaseTrendData: any[];
  waterQualityTrendData: any[];
  hygieneModules: any[];
  hygieneScore: number;
}

const ScreenRouter: React.FC<ScreenRouterProps> = ({
  currentScreen,
  colors,
  styles,
  handleNavigation,
  handleAssessmentComplete,
  handleRegionSelect,
  handleHygieneUpdate,
  userLocation,
  userName,
  userEmail,
  userId,
  userRiskLevel,
  onLogout,
  geoAlertVisible,
  setGeoAlertVisible,
  selectedRegion,
  regions,
  filteredOutbreaks,
  preventionCampaigns,
  filteredWaterAlerts,
  predictionInsights,
  alerts,
  diseaseTrendData,
  waterQualityTrendData,
  hygieneModules,
  hygieneScore,
}) => {
  switch (currentScreen) {
    case 'SelfAssessment':
      return (
        <SelfAssessment
          onComplete={handleAssessmentComplete}
          onClose={() => handleNavigation('Dashboard')}
        />
      );
    case 'NationalStats':
      return <NationalStats onNavigate={handleNavigation} />;
    case 'HotspotMap':
      return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <CategorizedMap
            userLocation={userLocation}
            fullscreen={true}
            onBack={() => handleNavigation('Dashboard')}
          />
        </View>
      );
    case 'TestingLabs':
      return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.screenHeader}>
            <TouchableOpacity
              onPress={() => handleNavigation('Dashboard')}
              activeOpacity={0.6}
              style={{ marginBottom: spacing.md }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Approved Testing Labs</Text>
            <Text style={styles.screenSubtitle}>Water testing & pathology facilities near you</Text>
          </View>
          <View style={styles.section}>
            <TestingLabs />
          </View>
        </ScrollView>
      );
    case 'Helpline':
      return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.screenHeader}>
            <TouchableOpacity
              onPress={() => handleNavigation('Dashboard')}
              activeOpacity={0.6}
              style={{ marginBottom: spacing.md }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Emergency Helpline</Text>
          </View>
          <View style={styles.section}>
            <EmergencyHelpline onClose={() => handleNavigation('Dashboard')} />
          </View>
        </ScrollView>
      );
    case 'HealthCertificate':
      return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.screenHeader}>
            <TouchableOpacity
              onPress={() => handleNavigation('Dashboard')}
              activeOpacity={0.6}
              style={{ marginBottom: spacing.md }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
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
    case 'FieldWorkerLogistics':
      return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.screenHeader}>
            <TouchableOpacity
              onPress={() => handleNavigation('Dashboard')}
              activeOpacity={0.6}
              style={{ marginBottom: spacing.md }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Field Worker Logistics</Text>
            <Text style={styles.screenSubtitle}>Inventory & Active Dispatches</Text>
          </View>
          <View style={styles.section}>
            <FieldWorkerLogistics />
          </View>
        </ScrollView>
      );
    case 'CommunityReport':
      return <CommunityReport onBack={() => handleNavigation('Dashboard')} />;
    case 'Telemedicine':
      return <Telemedicine onBack={() => handleNavigation('Dashboard')} />;
    case 'HygieneEducation':
      return (
        <HygieneEducation
          onBack={() => handleNavigation('Dashboard')}
          modules={hygieneModules}
          score={hygieneScore}
          onUpdateModule={handleHygieneUpdate}
        />
      );
    case 'Profile':
      return (
        <ProfilePage
          onBack={() => handleNavigation('Dashboard')}
          onNavigate={handleNavigation}
          userName={userName}
          userEmail={userEmail}
          onLogout={onLogout}
        />
      );
    case 'Settings':
      return (
        <SettingsPage
          onNavigate={handleNavigation}
          userId={userId}
          userEmail={userEmail}
          userName={userName}
        />
      );
    case 'Outbreaks':
      return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { marginTop: spacing.md }]}>
            <Text style={styles.sectionTitle}>Active Outbreaks</Text>
            {filteredOutbreaks.length > 0 ? (
              filteredOutbreaks.map((item) => (
                <Card
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  description={item.description}
                  location={item.location}
                  type={item.type}
                  severity={item.severity}
                  caseCount={item.caseCount}
                  onPress={() => {}}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>✓</Text>
                <Text style={styles.emptyStateText}>No active outbreaks in this region</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prevention Campaigns</Text>
            {preventionCampaigns.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                date={item.date}
                description={item.description}
                location={item.location}
                type={item.type}
                severity={item.severity}
                onPress={() => {}}
              />
            ))}
          </View>
        </ScrollView>
      );
    case 'WaterQuality':
      return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { marginTop: spacing.md }]}>
            <Text style={styles.sectionTitle}>Water Quality Alerts</Text>
            {filteredWaterAlerts.length > 0 ? (
              filteredWaterAlerts.map((item) => (
                <Card
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  description={item.description}
                  location={item.location}
                  type={item.type}
                  severity={item.severity}
                  onPress={() => {}}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>💧</Text>
                <Text style={styles.emptyStateText}>All water sources are safe in this region</Text>
              </View>
            )}
          </View>
          <View style={styles.section}>
            <CategorizedMap
              userLocation={userLocation}
              compact
              onExpand={() => handleNavigation('HotspotMap')}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Regional Risk Map</Text>
            <RiskHeatmap selectedRegion={selectedRegion} />
          </View>
          <View style={styles.section}>
            <RiskAnalysisPanel
              locationName={userLocation === 'Locating...' ? 'your area' : userLocation}
            />
          </View>
        </ScrollView>
      );
    case 'Warnings':
      return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { marginTop: spacing.md }]}>
            <AdvisoriesPanel />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Predictions</Text>
            <Text style={styles.sectionSubtitle}>Transparent outbreak probability analysis</Text>
            {predictionInsights.map((insight) => (
              <View key={insight.id} style={styles.cardGap}>
                <ExplainabilityPanel insight={insight} />
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <AlertHistoryPanel alerts={alerts} maxItems={5} />
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>HealthDrop Surveillance System</Text>
            <Text style={styles.footerSubtext}>Powered by AI · Real-time Monitoring</Text>
          </View>
        </ScrollView>
      );

    case 'Dashboard':
    default:
      return (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {geoAlertVisible && (
            <View style={styles.geoAlert}>
              <Ionicons name="location" size={24} color="#fff" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.geoAlertTitle}>High Risk Zone Detected</Text>
                <Text style={styles.geoAlertText}>You are near a reported contamination site.</Text>
              </View>
              <TouchableOpacity onPress={() => setGeoAlertVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <HeroSection userName={userName} selectedRegion={selectedRegion} />
          <RegionFilter
            regions={regions}
            selectedRegion={selectedRegion}
            onSelect={handleRegionSelect}
          />

          {/* Additional Info grouped together */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Services</Text>
            <View style={styles.quickActionsGrid}>
              {[
                { icon: 'megaphone', label: 'Report', screen: 'CommunityReport' },
                { icon: 'flask', label: 'Labs', screen: 'TestingLabs' },
                { icon: 'warning', label: 'Helpline', screen: 'Helpline' },
                { icon: 'cube', label: 'Logistics', screen: 'FieldWorkerLogistics' },
                { icon: 'bulb', label: 'Learn', screen: 'HygieneEducation' },
                { icon: 'settings', label: 'Settings', screen: 'Settings' },
              ].map((action) => (
                <TouchableOpacity
                  key={action.screen}
                  style={styles.quickActionItem}
                  onPress={() => handleNavigation(action.screen)}
                  activeOpacity={0.7}>
                  <Ionicons
                    name={action.icon as any}
                    size={28}
                    color={colors.primary}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ProximityStats />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trends Overview</Text>
            <View style={styles.cardGap}>
              <TrendChart
                data={diseaseTrendData}
                title="Disease Cases"
                subtitle="Monthly reported cases"
                color={colors.error}
                unit=" cases"
              />
            </View>
            <View style={styles.cardGap}>
              <TrendChart
                data={waterQualityTrendData}
                title="Water Quality Index"
                subtitle="Average safety score"
                color={colors.primary}
                unit="%"
              />
            </View>
          </View>
        </ScrollView>
      );
  }
};

export default ScreenRouter;
