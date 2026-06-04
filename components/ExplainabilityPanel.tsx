import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { PredictionInsight, PredictionInsightFactor } from '../types/models';

interface ProximityRiskAnalysisProps {
  insight?: PredictionInsight;
}

const ExplainabilityPanel: React.FC<ProximityRiskAnalysisProps> = ({ insight }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!insight) return null;

  const probabilityPercent = Math.round(insight.probability * 100);

  let riskLevel = 'Low';
  if (probabilityPercent >= 70) riskLevel = 'Severe';
  else if (probabilityPercent >= 50) riskLevel = 'High';
  else if (probabilityPercent >= 30) riskLevel = 'Moderate';

  const getProbabilityColor = (level: string) => {
    if (level === 'Severe' || level === 'High') return colors.error;
    if (level === 'Moderate') return colors.warning;
    return colors.success;
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'up' ? 'trending-up-outline' : 'trending-down-outline';
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 0.3) return colors.error;
    if (impact >= 0.15) return colors.warning;
    return colors.primary;
  };

  const probColor = getProbabilityColor(riskLevel);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.diseaseLabel}>{insight.disease} Advisory</Text>
          <Text style={styles.regionLabel}>{insight.region} Analysis</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.probability, { color: probColor }]}>{riskLevel} Risk</Text>
          <Text style={styles.timeframe}>{insight.timeframe}</Text>
        </View>
      </View>

      {/* Analysis Text */}
      <View style={styles.reasoningSection}>
        <Text style={styles.reasoningTitle}>Why does this risk exist?</Text>
        <Text style={styles.reasoningText}>{insight.reasoning}</Text>
      </View>

      {/* Key Contributing Factors */}
      <View style={styles.factorsSection}>
        <Text style={styles.factorsTitle}>Signal Integration</Text>

        {insight.factors?.map((factor: PredictionInsightFactor, index: number) => (
          <View key={index} style={styles.factorRow}>
            <Ionicons
              name={getDirectionIcon(factor.direction)}
              size={20}
              color={getImpactColor(factor.impact)}
              style={styles.factorIcon}
            />
            <View style={styles.factorTextContainer}>
              <Text style={styles.factorName}>{factor.name}</Text>
              <Text style={styles.factorDesc}>
                Impact: {Math.round(factor.impact * 100)}% ({factor.direction.toUpperCase()})
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Practical Advice */}
      <View style={[styles.reasoningSection, { backgroundColor: colors.primary + '10' }]}>
        <Text style={[styles.reasoningTitle, { color: colors.primary, marginBottom: spacing.xs }]}>
          <Ionicons name="shield-checkmark" size={16} /> Protective Actions
        </Text>
        <Text style={styles.reasoningText}>
          • Follow local health guidelines for {insight.disease.toLowerCase()} prevention.
          {'\n'}• Maintain high hygiene standards in affected areas.
          {'\n'}• Immediately report symptoms via the Telemedicine portal.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    headerLeft: {
      flex: 1,
    },
    diseaseLabel: {
      ...typography.title3,
      color: colors.text,
    },
    regionLabel: {
      ...typography.caption1,
      color: colors.textSecondary,
      marginTop: 4,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    probability: {
      ...typography.headline,
    },
    timeframe: {
      ...typography.caption2,
      color: colors.textTertiary,
      marginTop: 4,
    },
    factorsSection: {
      marginBottom: spacing.xl,
    },
    factorsTitle: {
      ...typography.subhead,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.md,
    },
    factorRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    factorIcon: {
      marginRight: spacing.md,
      marginTop: 2,
    },
    factorTextContainer: {
      flex: 1,
    },
    factorName: {
      ...typography.subhead,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 2,
    },
    factorDesc: {
      ...typography.caption1,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    reasoningSection: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.md,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    reasoningTitle: {
      ...typography.subhead,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    reasoningText: {
      ...typography.callout,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });

export default React.memo(ExplainabilityPanel);
