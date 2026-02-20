import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { PredictionInsight } from '../lib/mockData';

interface ExplainabilityPanelProps {
    insight: PredictionInsight;
}

const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ insight }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const getProbabilityColor = (prob: number) => {
        if (prob >= 0.7) return colors.error;
        if (prob >= 0.4) return colors.warning;
        return colors.success;
    };

    const probColor = getProbabilityColor(insight.probability);
    const maxImpact = Math.max(...insight.factors.map(f => f.impact));

    return (
        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.diseaseLabel}>{insight.disease}</Text>
                    <Text style={styles.regionLabel}>{insight.region}</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={[styles.probability, { color: probColor }]}>
                        {Math.round(insight.probability * 100)}%
                    </Text>
                    <Text style={styles.timeframe}>{insight.timeframe}</Text>
                </View>
            </View>

            {/* Probability Bar */}
            <View style={styles.probBarContainer}>
                <View style={styles.probBarBg}>
                    <View
                        style={[
                            styles.probBarFill,
                            {
                                width: `${insight.probability * 100}%` as any,
                                backgroundColor: probColor,
                            },
                        ]}
                    />
                </View>
                <View style={styles.probLabels}>
                    <Text style={styles.probLabel}>Low Risk</Text>
                    <Text style={styles.probLabel}>High Risk</Text>
                </View>
            </View>

            {/* Feature Importance */}
            <View style={styles.factorsSection}>
                <Text style={styles.factorsTitle}>Contributing Factors</Text>
                {insight.factors.map((factor, index) => {
                    const barWidth = (factor.impact / maxImpact) * 100;
                    const factorColor = factor.direction === 'up' ? colors.error : colors.success;
                    return (
                        <View key={index} style={styles.factorRow}>
                            <View style={styles.factorLabelContainer}>
                                <Text style={styles.factorDirection}>
                                    {factor.direction === 'up' ? '↑' : '↓'}
                                </Text>
                                <Text style={styles.factorName} numberOfLines={1}>{factor.name}</Text>
                            </View>
                            <View style={styles.factorBarContainer}>
                                <View
                                    style={[
                                        styles.factorBar,
                                        { width: `${barWidth}%` as any, backgroundColor: factorColor },
                                    ]}
                                />
                            </View>
                            <Text style={[styles.factorImpact, { color: factorColor }]}>
                                {Math.round(factor.impact * 100)}%
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Reasoning */}
            <View style={styles.reasoningSection}>
                <Text style={styles.reasoningTitle}>Analysis</Text>
                <Text style={styles.reasoningText}>{insight.reasoning}</Text>
            </View>

            {/* Confidence */}
            <View style={styles.confidenceRow}>
                <Text style={styles.confidenceLabel}>Model Confidence</Text>
                <View style={styles.confidenceBarBg}>
                    <View
                        style={[
                            styles.confidenceBarFill,
                            { width: `${insight.confidence * 100}%` as any },
                        ]}
                    />
                </View>
                <Text style={styles.confidenceValue}>{Math.round(insight.confidence * 100)}%</Text>
            </View>
        </BlurView>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.glass,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            overflow: 'hidden',
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
            ...typography.headline,
            color: colors.text,
        },
        regionLabel: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginTop: 2,
        },
        headerRight: {
            alignItems: 'flex-end',
        },
        probability: {
            ...typography.title1,
        },
        timeframe: {
            ...typography.caption2,
            color: colors.textSecondary,
            marginTop: 2,
        },
        probBarContainer: {
            marginBottom: spacing.xl,
        },
        probBarBg: {
            height: 6,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 3,
            overflow: 'hidden',
        },
        probBarFill: {
            height: '100%',
            borderRadius: 3,
        },
        probLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing.xs,
        },
        probLabel: {
            ...typography.caption2,
            color: colors.textTertiary,
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
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        factorLabelContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            width: 130,
        },
        factorDirection: {
            fontSize: 12,
            marginRight: spacing.xs,
            fontWeight: '600',
        },
        factorName: {
            ...typography.caption1,
            color: colors.text,
            flex: 1,
        },
        factorBarContainer: {
            flex: 1,
            height: 4,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 2,
            marginHorizontal: spacing.sm,
            overflow: 'hidden',
        },
        factorBar: {
            height: '100%',
            borderRadius: 2,
        },
        factorImpact: {
            ...typography.caption2,
            fontWeight: '600',
            width: 36,
            textAlign: 'right',
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
        },
        reasoningText: {
            ...typography.caption1,
            color: colors.textSecondary,
            lineHeight: 18,
        },
        confidenceRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        confidenceLabel: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginRight: spacing.md,
        },
        confidenceBarBg: {
            flex: 1,
            height: 4,
            backgroundColor: colors.surfaceVariant,
            borderRadius: 2,
            overflow: 'hidden',
            marginRight: spacing.sm,
        },
        confidenceBarFill: {
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 2,
        },
        confidenceValue: {
            ...typography.caption1,
            color: colors.primary,
            fontWeight: '600',
        },
    });

export default React.memo(ExplainabilityPanel);
