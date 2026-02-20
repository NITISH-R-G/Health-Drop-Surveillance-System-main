import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { regions as allRegions } from '../lib/mockData';

interface RiskHeatmapProps {
    selectedRegion?: string;
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ selectedRegion = 'all' }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const displayRegions = allRegions.filter(r => r.id !== 'all');

    const getRiskColor = (level: string, score: number) => {
        if (level === 'critical') return colors.error;
        if (level === 'high') return colors.warning;
        if (level === 'medium') return '#FF9500';
        return colors.success;
    };

    const getRiskBg = (level: string) => {
        if (level === 'critical') return colors.errorLight;
        if (level === 'high') return colors.warningLight;
        if (level === 'medium') return '#FF950012';
        return colors.successLight;
    };

    return (
        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Risk Assessment</Text>
                <Text style={styles.subtitle}>Regional risk levels</Text>
            </View>

            <View style={styles.grid}>
                {displayRegions.map((region) => {
                    const isSelected = selectedRegion === region.id;
                    const riskColor = getRiskColor(region.riskLevel, region.riskScore);
                    return (
                        <View
                            key={region.id}
                            style={[
                                styles.cell,
                                { backgroundColor: getRiskBg(region.riskLevel) },
                                isSelected && { borderColor: riskColor, borderWidth: 2 },
                            ]}
                        >
                            <Text style={styles.cellName} numberOfLines={1}>{region.name}</Text>
                            <Text style={[styles.cellScore, { color: riskColor }]}>
                                {region.riskScore}
                            </Text>
                            <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                                <Text style={styles.riskText}>
                                    {region.riskLevel.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.legend}>
                {[
                    { label: 'Low', color: colors.success },
                    { label: 'Medium', color: '#FF9500' },
                    { label: 'High', color: colors.warning },
                    { label: 'Critical', color: colors.error },
                ].map((item) => (
                    <View key={item.label} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                ))}
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
            marginBottom: spacing.lg,
        },
        title: {
            ...typography.headline,
            color: colors.text,
        },
        subtitle: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginTop: 2,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.sm,
        },
        cell: {
            width: '31%' as any,
            aspectRatio: 1,
            borderRadius: radius.md,
            padding: spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        cellName: {
            ...typography.caption1,
            color: colors.text,
            fontWeight: '600',
            marginBottom: spacing.xs,
        },
        cellScore: {
            ...typography.title2,
            marginBottom: spacing.xs,
        },
        riskBadge: {
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
            borderRadius: radius.sm,
        },
        riskText: {
            ...typography.caption2,
            color: '#FFFFFF',
            fontWeight: '700',
        },
        legend: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: spacing.lg,
            gap: spacing.lg,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        legendDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: spacing.xs,
        },
        legendLabel: {
            ...typography.caption2,
            color: colors.textSecondary,
        },
    });

export default React.memo(RiskHeatmap);
