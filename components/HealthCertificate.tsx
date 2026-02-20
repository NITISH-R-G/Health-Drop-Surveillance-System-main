import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface HealthCertificateProps {
    userName?: string;
    riskLevel?: 'low' | 'moderate' | 'high' | 'critical';
    lastAssessedDate?: string;
    location?: string;
    certificateId?: string;
}

const HealthCertificate: React.FC<HealthCertificateProps> = ({
    userName = 'Health Worker',
    riskLevel = 'low',
    lastAssessedDate = '20 Feb 2026, 12:00 PM',
    location = 'New Delhi, India',
    certificateId = 'HD-2026-00482',
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const statusConfig = {
        low: { color: '#34C759', label: 'CLEARED', icon: 'checkmark-circle', message: 'No water-borne disease risk detected' },
        moderate: { color: '#FF9500', label: 'ADVISORY', icon: 'warning', message: 'Moderate risk — precautions advised' },
        high: { color: '#FF6B35', label: 'RESTRICTED', icon: 'warning', message: 'High risk — medical clearance needed' },
        critical: { color: '#FF3B30', label: 'NOT CLEARED', icon: 'close-circle', message: 'Active infection suspected' },
    };

    const status = statusConfig[riskLevel];

    // Simple QR code representation (ASCII-art style grid)
    const qrGrid = useMemo(() => {
        const size = 9;
        const grid: boolean[][] = [];
        // Generate deterministic pattern from certificateId
        let hash = 0;
        for (let i = 0; i < certificateId.length; i++) {
            hash = ((hash << 5) - hash + certificateId.charCodeAt(i)) | 0;
        }
        for (let r = 0; r < size; r++) {
            grid[r] = [];
            for (let c = 0; c < size; c++) {
                // Corner patterns (always filled)
                if ((r < 3 && c < 3) || (r < 3 && c >= size - 3) || (r >= size - 3 && c < 3)) {
                    grid[r][c] = true;
                } else {
                    grid[r][c] = ((hash >> (r * size + c)) & 1) === 1;
                }
            }
        }
        return grid;
    }, [certificateId]);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Header stripe */}
                <View style={[styles.headerStripe, { backgroundColor: status.color }]}>
                    <Ionicons name={status.icon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.headerLabel}>{status.label}</Text>
                </View>

                {/* Certificate content */}
                <View style={styles.content}>
                    <Text style={styles.certTitle}>Health Clearance Certificate</Text>
                    <Text style={styles.certSubtitle}>Water-Borne Disease Assessment</Text>

                    {/* User Info */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Name</Text>
                            <Text style={styles.infoValue}>{userName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Location</Text>
                            <Text style={styles.infoValue}>{location}</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Certificate ID</Text>
                            <Text style={styles.infoValue}>{certificateId}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Valid Until</Text>
                            <Text style={styles.infoValue}>72 hours</Text>
                        </View>
                    </View>

                    {/* QR Code */}
                    <View style={styles.qrContainer}>
                        <View style={styles.qrCode}>
                            {qrGrid.map((row, rIdx) => (
                                <View key={rIdx} style={styles.qrRow}>
                                    {row.map((filled, cIdx) => (
                                        <View
                                            key={cIdx}
                                            style={[styles.qrCell, filled && { backgroundColor: colors.text }]}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                        <Text style={styles.qrLabel}>Scan to verify</Text>
                    </View>

                    {/* Status message */}
                    <View style={[styles.statusBanner, { backgroundColor: `${status.color}12`, borderColor: `${status.color}30` }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>{status.message}</Text>
                    </View>

                    {/* Timestamp */}
                    <Text style={styles.timestamp}>Assessed on: {lastAssessedDate}</Text>
                    <Text style={styles.authority}>Issued by: HealthDrop Surveillance System</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                        <Text style={styles.actionBtnText}>
                            <Ionicons name="share-outline" size={16} color={colors.text} /> Share
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} activeOpacity={0.7}>
                        <Text style={[styles.actionBtnText, styles.actionBtnPrimaryText]}>
                            <Ionicons name="download-outline" size={16} color="#FFFFFF" /> Download
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {},
        card: {
            backgroundColor: colors.surface, borderRadius: radius.xl,
            borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
        },
        headerStripe: {
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            paddingVertical: spacing.md,
        },
        headerIcon: { fontSize: 18, color: '#FFFFFF', marginRight: spacing.sm, fontWeight: '700' },
        headerLabel: { ...typography.headline, color: '#FFFFFF', letterSpacing: 2 },
        content: { padding: spacing.xl },
        certTitle: { ...typography.title3, color: colors.text, textAlign: 'center' },
        certSubtitle: { ...typography.caption1, color: colors.textSecondary, textAlign: 'center', marginTop: 2, marginBottom: spacing.xl },
        infoRow: { flexDirection: 'row', marginBottom: spacing.lg },
        infoItem: { flex: 1 },
        infoLabel: { ...typography.caption2, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
        infoValue: { ...typography.callout, color: colors.text, fontWeight: '500', marginTop: 2 },
        qrContainer: { alignItems: 'center', marginVertical: spacing.xl },
        qrCode: {
            padding: spacing.md, backgroundColor: '#FFFFFF', borderRadius: radius.md,
        },
        qrRow: { flexDirection: 'row' },
        qrCell: {
            width: 8, height: 8, backgroundColor: '#F0F0F0', margin: 1, borderRadius: 1,
        },
        qrLabel: { ...typography.caption2, color: colors.textTertiary, marginTop: spacing.sm },
        statusBanner: {
            padding: spacing.md, borderRadius: radius.md, alignItems: 'center',
            borderWidth: 1, marginBottom: spacing.md,
        },
        statusText: { ...typography.subhead, fontWeight: '600' },
        timestamp: { ...typography.caption2, color: colors.textTertiary, textAlign: 'center' },
        authority: { ...typography.caption2, color: colors.textTertiary, textAlign: 'center', marginTop: 2 },
        actions: {
            flexDirection: 'row', gap: spacing.sm, padding: spacing.lg,
            borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderLight,
        },
        actionBtn: {
            flex: 1, paddingVertical: spacing.md, alignItems: 'center',
            borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
        },
        actionBtnText: { ...typography.callout, color: colors.text, fontWeight: '600' },
        actionBtnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
        actionBtnPrimaryText: { color: '#FFFFFF' },
    });

export default React.memo(HealthCertificate);
