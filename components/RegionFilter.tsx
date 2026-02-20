import React, { useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { Region } from '../lib/mockData';

interface RegionFilterProps {
    regions: Region[];
    selectedRegion: string;
    onSelect: (regionId: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({ regions, selectedRegion, onSelect }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'critical': return colors.error;
            case 'high': return colors.warning;
            case 'medium': return '#FF9500';
            default: return colors.success;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {regions.map((region) => {
                    const isSelected = selectedRegion === region.id;
                    const riskColor = getRiskColor(region.riskLevel);
                    return (
                        <TouchableOpacity
                            key={region.id}
                            style={[
                                styles.chip,
                                isSelected && styles.chipSelected,
                                isSelected && { borderColor: colors.primary },
                            ]}
                            onPress={() => onSelect(region.id)}
                            activeOpacity={0.7}
                        >
                            {region.id !== 'all' && (
                                <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
                            )}
                            <Text
                                style={[
                                    styles.chipText,
                                    isSelected && styles.chipTextSelected,
                                ]}
                            >
                                {region.name}
                            </Text>
                            {region.id !== 'all' && isSelected && (
                                <Text style={[styles.chipScore, { color: riskColor }]}>
                                    {region.riskScore}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            marginVertical: spacing.sm,
        },
        scrollContent: {
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
        },
        chip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm + 2,
            borderRadius: radius.full,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
        },
        chipSelected: {
            backgroundColor: colors.primaryLight,
        },
        riskDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: spacing.sm,
        },
        chipText: {
            ...typography.subhead,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        chipTextSelected: {
            color: colors.primary,
            fontWeight: '600',
        },
        chipScore: {
            ...typography.caption2,
            fontWeight: '700',
            marginLeft: spacing.sm,
        },
    });

export default React.memo(RegionFilter);
