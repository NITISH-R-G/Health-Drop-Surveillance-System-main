import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { TrendDataPoint } from '../lib/mockData';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';


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
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

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
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
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
                {chartType === 'bar' ? (
                    data.map((point, index) => {
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
                                                width: Math.min(barWidth, 48), // limit width to not look too bulky
                                                backgroundColor: chartColor,
                                                opacity,
                                                borderRadius: 6,
                                            },
                                        ]}
                                    />
                                </View>
                                {showLabels && (
                                    <Text style={styles.barLabel}>{point.label}</Text>
                                )}
                            </View>
                        );
                    })
                ) : (() => {
                    const chartWidth = Dimensions.get('window').width - spacing.lg * 2 - spacing.xl * 2;
                    const sliceWidth = chartWidth / data.length;
                    const points = data.map((point, index) => {
                        const x = (index + 0.5) * sliceWidth;
                        const y = (height - 24) - ((point.value - minValue) / range) * (height - 24);
                        return `${x},${Math.max(4, Math.min(y, height - 28))}`;
                    }).join(' ');

                    return (
                        <>
                            {/* Make SVG sit behind labels so labels remain interactive/visible */}
                            <Svg height={height - 24} width="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                                <Polyline
                                    points={points}
                                    fill="none"
                                    stroke={chartColor}
                                    strokeWidth="3"
                                />
                                {data.map((point, index) => {
                                    const x = (index + 0.5) * sliceWidth;
                                    const y = (height - 24) - ((point.value - minValue) / range) * (height - 24);
                                    return (
                                        <Circle
                                            key={index}
                                            cx={x}
                                            cy={Math.max(4, Math.min(y, height - 28))}
                                            r="4"
                                            fill={colors.surface}
                                            stroke={chartColor}
                                            strokeWidth="2"
                                        />
                                    );
                                })}
                            </Svg>
                            {/* Keep the columns present solely for label rendering, using flex-end to push labels down */}
                            <View style={{ flex: 1, flexDirection: 'row', width: '100%', height: '100%', zIndex: 1 }}>
                                {data.map((point, index) => (
                                    <View key={index} style={styles.barColumn}>
                                        <View style={styles.barWrapper} />
                                        {showLabels && (
                                            <Text style={styles.barLabel}>{point.label}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </>
                    );
                })()}
            </View>

            <View style={styles.chartControls}>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setChartType(prev => (prev === 'bar' ? 'line' : 'bar'))}
                    activeOpacity={0.6}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={chartType === 'bar' ? 'pulse' : 'bar-chart'}
                        size={16}
                        color={colors.primary}
                    />
                </TouchableOpacity>
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
        titleContainer: {
            flex: 1,
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
        },
        toggleButton: {
            padding: 8, // slight increase for a better touch target visually 
            backgroundColor: colors.primary + '10', // softer background
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.primary + '25',
        },
        chartControls: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: spacing.sm,
            marginRight: -spacing.sm, // nicely aligns with the chart edge
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
