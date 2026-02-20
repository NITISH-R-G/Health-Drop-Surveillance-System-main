import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface Lab {
    id: string;
    name: string;
    type: 'water' | 'pathology' | 'both';
    address: string;
    phone: string;
    distance: string;
    accredited: boolean;
    services: string[];
}

interface TestingLabsProps {
    labs?: Lab[];
}

const defaultLabs: Lab[] = [
    { id: '1', name: 'Central Water Testing Lab', type: 'water', address: 'Ring Road, New Delhi - 110003', phone: '011-23456789', distance: '1.2 km', accredited: true, services: ['Bacteriological', 'Chemical', 'Heavy metals'] },
    { id: '2', name: 'District Pathology Center', type: 'pathology', address: 'Civil Lines, Sector 12', phone: '011-98765432', distance: '2.5 km', accredited: true, services: ['Stool culture', 'Blood test', 'Widal test'] },
    { id: '3', name: 'National Institute of Cholera', type: 'both', address: 'P-33 CIT Road, Beliaghata', phone: '033-23633373', distance: '3.8 km', accredited: true, services: ['Cholera diagnosis', 'Water testing', 'Vibrio culture'] },
    { id: '4', name: 'Municipal Water Lab', type: 'water', address: 'Jal Bhawan, Civic Center', phone: '011-23402522', distance: '4.1 km', accredited: true, services: ['pH testing', 'Turbidity', 'Coliform count'] },
    { id: '5', name: 'ICMR Regional Lab', type: 'both', address: 'Ansari Nagar, AIIMS Campus', phone: '011-26588980', distance: '5.6 km', accredited: true, services: ['Full panel testing', 'Typhoid', 'Hepatitis A'] },
    { id: '6', name: 'Community Health Lab', type: 'pathology', address: 'PHC Block-B, Dwarka', phone: '011-25089012', distance: '7.3 km', accredited: false, services: ['Basic stool test', 'Rapid tests'] },
];

const typeConfig = {
    water: { icon: 'water', label: 'Water Testing', color: '#5AC8FA' },
    pathology: { icon: 'flask', label: 'Pathology', color: '#AF52DE' },
    both: { icon: 'medkit', label: 'Full Service', color: '#007AFF' },
};

const TestingLabs: React.FC<TestingLabsProps> = ({ labs = defaultLabs }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [filter, setFilter] = useState<'all' | 'water' | 'pathology' | 'both'>('all');

    const filteredLabs = filter === 'all' ? labs : labs.filter(l => l.type === filter);

    return (
        <View style={styles.container}>
            {/* Filter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {[
                    { key: 'all', label: 'All Labs', icon: 'business' },
                    { key: 'water', label: 'Water Testing', icon: 'water' },
                    { key: 'pathology', label: 'Pathology', icon: 'flask' },
                    { key: 'both', label: 'Full Service', icon: 'medkit' },
                ].map(f => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
                        onPress={() => setFilter(f.key as typeof filter)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={f.icon as any} size={14} color={filter === f.key ? '#FFFFFF' : colors.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Lab List */}
            {filteredLabs.map((lab) => {
                const cfg = typeConfig[lab.type];
                return (
                    <View key={lab.id} style={styles.labCard}>
                        <View style={styles.labHeader}>
                            <View style={[styles.labTypeIcon, { backgroundColor: `${cfg.color}15` }]}>
                                <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
                            </View>
                            <View style={styles.labInfo}>
                                <View style={styles.labNameRow}>
                                    <Text style={styles.labName}>{lab.name}</Text>
                                    {lab.accredited && (
                                        <View style={styles.accreditedBadge}>
                                            <Text style={styles.accreditedText}>✓ Approved</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.labAddress}>{lab.address}</Text>
                                <Text style={styles.labDistance}>
                                    <Ionicons name="location" size={12} color={colors.textTertiary} /> {lab.distance}
                                </Text>
                            </View>
                        </View>

                        {/* Services */}
                        <View style={styles.servicesRow}>
                            {lab.services.map((service) => (
                                <View key={service} style={styles.serviceChip}>
                                    <Text style={styles.serviceText}>{service}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                                <Text style={styles.actionText}>
                                    <Ionicons name="call" size={12} color={colors.primary} /> Call
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                                <Text style={styles.actionText}>
                                    <Ionicons name="map" size={12} color={colors.primary} /> Directions
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}

            {filteredLabs.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="flask" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyText}>No labs found for this filter</Text>
                </View>
            )}
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {},
        filterRow: { marginBottom: spacing.lg },
        filterChip: {
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.surface,
            borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm,
        },
        filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
        filterIcon: { fontSize: 14, marginRight: spacing.xs },
        filterLabel: { ...typography.caption1, color: colors.text, fontWeight: '500' },
        filterLabelActive: { color: '#FFFFFF' },
        labCard: {
            backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg,
            borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
        },
        labHeader: { flexDirection: 'row', marginBottom: spacing.md },
        labTypeIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
        labTypeEmoji: { fontSize: 20 },
        labInfo: { flex: 1, marginLeft: spacing.md },
        labNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
        labName: { ...typography.callout, color: colors.text, fontWeight: '600' },
        accreditedBadge: {
            backgroundColor: '#34C75915', paddingHorizontal: spacing.sm, paddingVertical: 1,
            borderRadius: radius.sm,
        },
        accreditedText: { ...typography.caption2, color: '#34C759', fontWeight: '700' },
        labAddress: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },
        labDistance: { ...typography.caption2, color: colors.textTertiary, marginTop: 2 },
        servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
        serviceChip: {
            backgroundColor: colors.surfaceVariant, paddingHorizontal: spacing.sm,
            paddingVertical: 2, borderRadius: radius.sm,
        },
        serviceText: { ...typography.caption2, color: colors.textSecondary },
        actionsRow: { flexDirection: 'row', gap: spacing.sm },
        actionButton: {
            flex: 1, paddingVertical: spacing.sm, alignItems: 'center',
            borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
        },
        actionText: { ...typography.caption1, color: colors.primary, fontWeight: '600' },
        emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
        emptyIcon: { fontSize: 32, marginBottom: spacing.sm },
        emptyText: { ...typography.subhead, color: colors.textSecondary },
    });

export default React.memo(TestingLabs);
