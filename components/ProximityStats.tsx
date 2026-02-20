import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface ProximityData {
    radius: string;
    cases: number;
    contamination: number;
}

interface ProximityStatsProps {
    data?: ProximityData[];
}

const defaultData: ProximityData[] = [
    { radius: '500m', cases: 2, contamination: 1 },
    { radius: '1 km', cases: 8, contamination: 3 },
    { radius: '2 km', cases: 15, contamination: 5 },
    { radius: '5 km', cases: 34, contamination: 9 },
    { radius: '10 km', cases: 67, contamination: 14 },
];

const ProximityStats: React.FC<ProximityStatsProps> = ({ data = defaultData }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const maxCases = Math.max(...data.map(d => d.cases));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nearby Cases</Text>
            <Text style={styles.subtitle}>Water-borne illness reports near you</Text>

            {/* Concentric rings visual */}
            <View style={styles.ringsContainer}>
                {data.map((item, index) => {
                    const size = 60 + index * 36;
                    const opacity = 0.08 + (index * 0.04);
                    return (
                        <View
                            key={item.radius}
                            style={[styles.ring, {
                                width: size, height: size, borderRadius: size / 2,
                                backgroundColor: `rgba(255, 59, 48, ${opacity})`,
                                borderColor: `rgba(255, 59, 48, ${0.15 + index * 0.05})`,
                            }]}
                        />
                    );
                })}
                <View style={styles.ringCenter}>
                    <Text style={styles.ringCenterIcon}>📍</Text>
                    <Text style={styles.ringCenterText}>You</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Radius</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Cases</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Contaminated</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1.5 }]} />
                </View>
                {data.map((item) => {
                    const barWidth = (item.cases / maxCases) * 100;
                    return (
                        <View key={item.radius} style={styles.tableRow}>
                            <Text style={[styles.radiusText, { flex: 1 }]}>{item.radius}</Text>
                            <Text style={[styles.casesText, { flex: 1, textAlign: 'center' }]}>{item.cases}</Text>
                            <Text style={[styles.contaminationText, { flex: 1, textAlign: 'center' }]}>{item.contamination}</Text>
                            <View style={{ flex: 1.5 }}>
                                <View style={styles.barBackground}>
                                    <View style={[styles.barFill, { width: `${barWidth}%` }]} />
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <View style={styles.footerDot} />
                <Text style={styles.footerText}>Based on reported cases in last 14 days</Text>
            </View>
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl,
            borderWidth: 1, borderColor: colors.border,
        },
        title: { ...typography.title3, color: colors.text },
        subtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
        ringsContainer: {
            height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl,
        },
        ring: {
            position: 'absolute', borderWidth: 1, justifyContent: 'center', alignItems: 'center',
        },
        ringCenter: { alignItems: 'center', zIndex: 10 },
        ringCenterIcon: { fontSize: 20 },
        ringCenterText: { ...typography.caption2, color: colors.textSecondary, marginTop: 2 },
        table: {},
        tableHeader: {
            flexDirection: 'row', paddingBottom: spacing.sm,
            borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderLight,
        },
        tableHeaderText: { ...typography.caption2, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
        tableRow: {
            flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm + 2,
            borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderLight,
        },
        radiusText: { ...typography.callout, color: colors.text, fontWeight: '500' },
        casesText: { ...typography.callout, color: colors.error, fontWeight: '700' },
        contaminationText: { ...typography.callout, color: colors.warning, fontWeight: '600' },
        barBackground: {
            height: 6, backgroundColor: colors.surfaceVariant, borderRadius: 3, overflow: 'hidden',
        },
        barFill: { height: '100%', backgroundColor: colors.error, borderRadius: 3 },
        footer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
        footerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textTertiary, marginRight: spacing.sm },
        footerText: { ...typography.caption2, color: colors.textTertiary },
    });

export default React.memo(ProximityStats);
