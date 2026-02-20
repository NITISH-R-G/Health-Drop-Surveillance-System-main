import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { outbreaks } from '../lib/mockData';

interface ProximityData {
    radius: string;
    cases: number;
    contamination: number;
}

interface ProximityStatsProps {
    userLocation?: { lat: number; lng: number };
}

// Simulated User Location (Coimbatore Center)
const defaultLocation = { lat: 11.0168, lng: 76.9558 };

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const ProximityStats: React.FC<ProximityStatsProps> = ({ userLocation = defaultLocation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const data = useMemo(() => {
        const rings = [
            { limit: 0.5, label: '500m' },
            { limit: 1.0, label: '1 km' },
            { limit: 2.0, label: '2 km' },
            { limit: 5.0, label: '5 km' },
            { limit: 10.0, label: '10 km' }
        ];

        const aggregatedData = rings.map(ring => ({
            radius: ring.label,
            limit: ring.limit,
            cases: 0,
            contamination: 0
        }));

        // Filter for Coimbatore outbreaks to keep things relevant to our test dataset
        const coimbatoreOutbreaks = outbreaks.filter(o => o.regionId === 'reg-1');

        coimbatoreOutbreaks.forEach(outbreak => {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                outbreak.coordinates?.latitude || userLocation.lat,
                outbreak.coordinates?.longitude || userLocation.lng
            );

            // Add cases to all rings that cover this distance
            aggregatedData.forEach(ring => {
                if (distance <= ring.limit) {
                    ring.cases += outbreak.caseCount || 1; // Default to 1 case if unknown
                    ring.contamination += 1; // Count each outbreak location as 1 contaminated source
                }
            });
        });

        return aggregatedData;
    }, [userLocation]);

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
