import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import MapView, { Marker, Circle } from './Map';

const { height } = Dimensions.get('window');

interface HotspotZone {
    id: string;
    name: string;
    level: 'safe' | 'caution' | 'contaminated' | 'outbreak';
    cases: number;
    waterSources: number;
    latitude: number;
    longitude: number;
}

interface HotspotMapProps {
    zones?: HotspotZone[];
    onZonePress?: (zone: HotspotZone) => void;
}

const defaultZones: HotspotZone[] = [
    { id: '1', name: 'Sector A', level: 'safe', cases: 0, waterSources: 5, latitude: 25.5788, longitude: 91.8933 },
    { id: '2', name: 'Sector B', level: 'caution', cases: 3, waterSources: 3, latitude: 25.5888, longitude: 91.8833 },
    { id: '3', name: 'Sector C', level: 'contaminated', cases: 8, waterSources: 2, latitude: 25.5688, longitude: 91.9033 },
    { id: '4', name: 'Sector D', level: 'safe', cases: 1, waterSources: 6, latitude: 25.5988, longitude: 91.8733 },
    { id: '5', name: 'Sector E', level: 'outbreak', cases: 22, waterSources: 1, latitude: 25.5588, longitude: 91.8633 },
    { id: '6', name: 'Sector F', level: 'caution', cases: 5, waterSources: 4, latitude: 25.5488, longitude: 91.8533 },
    { id: '7', name: 'Sector G', level: 'safe', cases: 0, waterSources: 7, latitude: 25.6088, longitude: 91.9133 },
    { id: '8', name: 'Sector H', level: 'contaminated', cases: 11, waterSources: 2, latitude: 25.6188, longitude: 91.9233 },
    { id: '9', name: 'Sector I', level: 'caution', cases: 4, waterSources: 3, latitude: 25.5388, longitude: 91.8433 },
    { id: '10', name: 'Sector J', level: 'safe', cases: 0, waterSources: 8, latitude: 25.5288, longitude: 91.8333 },
    { id: '11', name: 'Sector K', level: 'outbreak', cases: 18, waterSources: 1, latitude: 25.5688, longitude: 91.8533 },
    { id: '12', name: 'Sector L', level: 'safe', cases: 1, waterSources: 5, latitude: 25.5888, longitude: 91.8633 },
];

const levelConfig = {
    safe: { color: '#34C759', bg: 'rgba(52, 199, 89, 0.4)', icon: 'water', label: 'Safe' },
    caution: { color: '#FF9500', bg: 'rgba(255, 149, 0, 0.4)', icon: 'warning', label: 'Caution' },
    contaminated: { color: '#FF6B35', bg: 'rgba(255, 107, 53, 0.4)', icon: 'skull', label: 'Contaminated' },
    outbreak: { color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.4)', icon: 'nuclear', label: 'Outbreak' },
};

const HotspotMap: React.FC<HotspotMapProps> = ({ zones = defaultZones, onZonePress }) => {
    const { colors, theme } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<HotspotZone | null>(null);
    const slideAnim = useRef(new Animated.Value(400)).current;

    const openMap = () => setIsFullScreen(true);
    const closeMap = () => {
        setIsFullScreen(false);
        setSelectedZone(null);
    };

    const handleMarkerPress = (zone: HotspotZone) => {
        setSelectedZone(zone);
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
        }).start();
        onZonePress?.(zone);
    };

    const closeCard = () => {
        Animated.timing(slideAnim, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setSelectedZone(null));
    };

    const renderPreview = () => (
        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Contamination Hotspots</Text>
                    <Text style={styles.subtitle}>Real-time monitoring across sectors</Text>
                </View>
                <TouchableOpacity style={styles.expandButton} onPress={openMap}>
                    <Text style={styles.expandText}>Expand Map</Text>
                    <Ionicons name="expand" size={16} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Dashboard Preview Tap Target */}
            <TouchableOpacity style={styles.mapPreviewContainer} activeOpacity={0.8} onPress={openMap}>
                <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                    <MapView
                        style={StyleSheet.absoluteFill}
                        initialRegion={{ latitude: 25.5788, longitude: 91.8833, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
                    >
                        {zones.map(z => (
                            <Circle key={z.id} center={{ latitude: z.latitude, longitude: z.longitude }} radius={1000} fillColor={levelConfig[z.level].bg} strokeColor={levelConfig[z.level].color} />
                        ))}
                    </MapView>
                </View>
                <View style={styles.previewOverlay}>
                    <View style={styles.previewPlayButton}>
                        <Ionicons name="map" size={24} color="#FFF" />
                    </View>
                    <Text style={styles.previewOverlayText}>Tap to Explore Live Map</Text>
                </View>
            </TouchableOpacity>

            {/* Summary Layer beneath the preview */}
            <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.error }]}>{zones.filter(z => z.level === 'outbreak').length}</Text>
                    <Text style={styles.summaryLabel}>Outbreak Zones</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>{zones.filter(z => z.level === 'contaminated').length}</Text>
                    <Text style={styles.summaryLabel}>Contaminated</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>{zones.filter(z => z.level === 'safe').length}</Text>
                    <Text style={styles.summaryLabel}>Safe Zones</Text>
                </View>
            </View>
        </BlurView>
    );

    const renderFullScreen = () => (
        <Modal visible={isFullScreen} animationType="fade" transparent={false} onRequestClose={closeMap}>
            <View style={styles.fullScreenWrapper}>
                <MapView
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={{ latitude: 25.5788, longitude: 91.8833, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
                    onPress={closeCard}
                >
                    {zones.map((zone) => {
                        const cfg = levelConfig[zone.level];
                        return (
                            <React.Fragment key={zone.id}>
                                <Circle center={{ latitude: zone.latitude, longitude: zone.longitude }} radius={1200} fillColor={cfg.bg} strokeColor={cfg.color} strokeWidth={2} />
                                <Marker coordinate={{ latitude: zone.latitude, longitude: zone.longitude }} onPress={(e) => { e.stopPropagation(); handleMarkerPress(zone); }}>
                                    <View style={[styles.markerBadge, { backgroundColor: cfg.color }]}>
                                        <Ionicons name={cfg.icon as any} size={14} color="#FFF" />
                                    </View>
                                </Marker>
                            </React.Fragment>
                        );
                    })}
                </MapView>

                {/* Glassmorphic Top Bar */}
                <BlurView intensity={Platform.OS === 'web' ? 0 : 80} tint={theme === 'dark' ? 'dark' : 'light'} style={[styles.topBar, Platform.OS === 'web' && { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)' } as any]}>
                    <TouchableOpacity onPress={closeMap} style={styles.iconButton}>
                        <Ionicons name="chevron-back" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={18} color={colors.textTertiary} />
                        <Text style={styles.searchText}>Search zones...</Text>
                    </View>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="options" size={24} color={colors.text} />
                    </TouchableOpacity>
                </BlurView>

                {/* Floating Action Buttons */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity style={styles.fab}>
                        <Ionicons name="locate" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.fab, { marginTop: spacing.md }]}>
                        <Ionicons name="layers" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Sliding Bottom Sheet */}
                {selectedZone && (
                    <Animated.View style={[styles.bottomSheetWrapper, { transform: [{ translateY: slideAnim }] }]}>
                        <BlurView intensity={Platform.OS === 'web' ? 0 : 90} tint={theme === 'dark' ? 'dark' : 'light'} style={[styles.bottomSheetInner, Platform.OS === 'web' && { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)' } as any]}>
                            <View style={styles.sheetHeader}>
                                <View style={styles.sheetHeaderTitleRow}>
                                    <View style={[styles.dotIndicator, { backgroundColor: levelConfig[selectedZone.level].color }]} />
                                    <Text style={styles.sheetTitle}>{selectedZone.name}</Text>
                                </View>
                                <TouchableOpacity onPress={closeCard} style={styles.closeSheetButton}>
                                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.sheetSubtitle}>Updated recently • Status: {levelConfig[selectedZone.level].label}</Text>

                            <View style={styles.sheetContent}>
                                <View style={styles.sheetStatBox}>
                                    <Ionicons name="people" size={24} color={colors.textTertiary} style={{ marginBottom: 4 }} />
                                    <Text style={styles.sheetStatValue}>{selectedZone.cases}</Text>
                                    <Text style={styles.sheetStatLabel}>Active Cases</Text>
                                </View>
                                <View style={styles.sheetStatBox}>
                                    <Ionicons name="water" size={24} color={colors.textTertiary} style={{ marginBottom: 4 }} />
                                    <Text style={styles.sheetStatValue}>{selectedZone.waterSources}</Text>
                                    <Text style={styles.sheetStatLabel}>Water Sources</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={[styles.actionButton, { backgroundColor: levelConfig[selectedZone.level].color }]}>
                                <Text style={styles.actionButtonText}>View Detailed Report</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        </BlurView>
                    </Animated.View>
                )}
            </View>
        </Modal>
    );

    return (
        <>
            {renderPreview()}
            {renderFullScreen()}
        </>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.glass, borderRadius: radius.xl, padding: spacing.xl,
            borderWidth: 1, borderColor: colors.glassBorder, marginBottom: spacing.lg, overflow: 'hidden'
        },
        headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
        title: { ...typography.title3, color: colors.text },
        subtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },
        expandButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '15', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.md },
        expandText: { ...typography.caption1, color: colors.primary, fontWeight: '600', marginRight: 4 },

        mapPreviewContainer: { height: 260, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surfaceLevel2, marginBottom: spacing.lg },
        previewOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
        previewPlayButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
        previewOverlayText: { color: '#FFF', ...typography.callout, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },

        summaryRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderLight },
        summaryItem: { alignItems: 'center' },
        summaryValue: { ...typography.title2 },
        summaryLabel: { ...typography.caption2, color: colors.textSecondary, marginTop: 2 },

        fullScreenWrapper: { flex: 1, backgroundColor: colors.background },

        topBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingBottom: spacing.md, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(150,150,150,0.2)' },
        iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface + '80', justifyContent: 'center', alignItems: 'center' },
        searchBar: { flex: 1, marginHorizontal: spacing.md, height: 44, backgroundColor: colors.surface + '80', borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md },
        searchText: { ...typography.callout, color: colors.textTertiary, marginLeft: spacing.sm },

        fabContainer: { position: 'absolute', right: spacing.lg, top: 120 },
        fab: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },

        markerBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },

        bottomSheetWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0 },
        bottomSheetInner: { padding: spacing.xl, paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(150,150,150,0.2)', shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 },
        sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
        sheetHeaderTitleRow: { flexDirection: 'row', alignItems: 'center' },
        dotIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
        sheetTitle: { ...typography.title2, color: colors.text },
        sheetSubtitle: { ...typography.caption1, color: colors.textSecondary, marginBottom: spacing.lg, marginLeft: 18 },
        closeSheetButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceLevel2, justifyContent: 'center', alignItems: 'center' },

        sheetContent: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
        sheetStatBox: { flex: 1, backgroundColor: colors.surface + '50', borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight },
        sheetStatValue: { ...typography.title3, color: colors.text },
        sheetStatLabel: { ...typography.caption2, color: colors.textSecondary, marginTop: 2 },

        actionButton: { flexDirection: 'row', height: 50, borderRadius: radius.full, justifyContent: 'center', alignItems: 'center' },
        actionButtonText: { ...typography.callout, color: '#FFF', fontWeight: '600' }
    });

export default React.memo(HotspotMap);
