import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { TrendDataPoint } from '../lib/mockData';

interface TrendChartProps {
    data: TrendDataPoint[];
    title: string;
    subtitle?: string;
    color?: string;
    height?: number;
    showLabels?: boolean;
    unit?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
    data,
    title,
    subtitle,
    color,
    height = 120,
    showLabels = true,
    unit = '',
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const chartColor = color || colors.primary;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const barWidth = useMemo(() => {
        const screenWidth = Dimensions.get('window').width;
        const chartWidth = screenWidth - spacing.xl * 2 - spacing.xl * 2 - spacing.lg * 2;
        const gap = 6;
        return Math.max(8, (chartWidth - gap * (data.length - 1)) / data.length);
    }, [data.length]);

    const latestValue = data[data.length - 1]?.value ?? 0;
    const previousValue = data.length > 1 ? data[data.length - 2]?.value ?? 0 : latestValue;
    const change = latestValue - previousValue;
    const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : '0';
    const isPositive = change >= 0;

    return (
        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <View style={styles.valueContainer}>
                    <Text style={styles.currentValue}>{latestValue}{unit}</Text>
                    <Text style={[styles.change, { color: isPositive ? colors.error : colors.success }]}>
                        {isPositive ? '↑' : '↓'} {Math.abs(Number(changePercent))}%
                    </Text>
                </View>
            </View>

            <View style={[styles.chartContainer, { height }]}>
                {data.map((point, index) => {
                    const barHeight = ((point.value - minValue) / range) * (height - 24);
                    const opacity = 0.4 + (index / (data.length - 1)) * 0.6;
                    return (
                        <View key={index} style={styles.barColumn}>
                            <View style={styles.barWrapper}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: Math.max(4, barHeight),
                                            width: barWidth,
                                            backgroundColor: chartColor,
                                            opacity,
                                            borderRadius: barWidth / 2,
                                        },
                                    ]}
                                />
                            </View>
                            {showLabels && (
                                <Text style={styles.barLabel}>{point.label}</Text>
                            )}
                        </View>
                    );
                })}
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
        titleContainer: {
            flex: 1,
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
        valueContainer: {
            alignItems: 'flex-end',
        },
        currentValue: {
            ...typography.title2,
            color: colors.text,
        },
        change: {
            ...typography.caption1,
            fontWeight: '600',
            marginTop: 2,
        },
        chartContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
        barColumn: {
            alignItems: 'center',
            flex: 1,
        },
        barWrapper: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        bar: {
            minHeight: 4,
        },
        barLabel: {
            ...typography.caption2,
            color: colors.textTertiary,
            marginTop: spacing.xs,
        },
    });

export default React.memo(TrendChart);
