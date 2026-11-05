import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { TestingLab } from '../types/models';
import { useSyncData } from '../lib/sync';

interface TestingLabsProps {
  labs?: TestingLab[];
}

const typeConfig = {
  water: { icon: 'water', label: 'Water Testing', color: '#5AC8FA' },
  pathology: { icon: 'flask', label: 'Pathology', color: '#AF52DE' },
  both: { icon: 'medkit', label: 'Full Service', color: '#007AFF' },
};

const TestingLabs: React.FC<TestingLabsProps> = ({ labs: propLabs }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [filter, setFilter] = useState<'all' | 'water' | 'pathology' | 'both'>('all');
  const [userLoc, setUserLoc] = useState<Location.LocationObject | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { data: syncedLabs, loading } = useSyncData('testingLabsData');

  const labs = propLabs || syncedLabs || [];

  const sortedLabs = useMemo(() => {
    const filteredLabs =
      filter === 'all' ? labs : labs.filter((l) => l.type === filter || l.type === 'both');
    return [...filteredLabs].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }, [labs, filter]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleGetLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to route from your current position.'
        );
        setIsLocating(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLoc(location);
    } catch (error) {
      Alert.alert('Location Error', 'Could not fetch location.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleDirections = (name: string, address: string) => {
    const query = encodeURIComponent(`${name}, ${address}`);
    if (userLoc) {
      const { latitude, longitude } = userLoc.coords;
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${query}`
      );
    } else {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            userLoc && { backgroundColor: `${colors.success}15`, borderColor: colors.success },
          ]}
          onPress={handleGetLocation}
          activeOpacity={0.7}
          disabled={isLocating}>
          {isLocating ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 6 }} />
          ) : (
            <Ionicons
              name="navigate"
              size={14}
              color={userLoc ? colors.success : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            style={[styles.filterLabel, userLoc && { color: colors.success, fontWeight: '600' }]}>
            {userLoc ? 'Location Found' : 'Find My Location'}
          </Text>
        </TouchableOpacity>
        {[
          { key: 'all', label: 'All Labs', icon: 'business' },
          { key: 'water', label: 'Water Testing', icon: 'water' },
          { key: 'pathology', label: 'Pathology', icon: 'flask' },
          { key: 'both', label: 'Full Service', icon: 'medkit' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key as typeof filter)}
            activeOpacity={0.7}>
            <Ionicons
              name={f.icon as any}
              size={14}
              color={filter === f.key ? '#FFFFFF' : colors.textSecondary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lab List */}
      {sortedLabs.map((lab) => {
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

                <View style={styles.contactRow}>
                  <View style={styles.contactItemWrapper}>
                    <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                    <Text style={styles.contactItemInfo}>{lab.timings || 'Contact to verify'}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: lab.isOpen ? `${colors.success}15` : `${colors.error}15` },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: lab.isOpen ? colors.success : colors.error },
                      ]}>
                      {lab.isOpen ? 'Open Now' : 'Closed'}
                    </Text>
                  </View>
                </View>

                {lab.email && (
                  <View style={styles.contactItemWrapper}>
                    <Ionicons name="mail" size={12} color={colors.textTertiary} />
                    <Text style={styles.contactItemInfo}>{lab.email}</Text>
                  </View>
                )}

                <Text style={styles.labDistance}>
                  <Ionicons name="location" size={12} color={colors.textTertiary} /> {lab.distance}{' '}
                  from you
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
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={() => handleCall(lab.phone)}>
                <Text style={styles.actionText}>
                  <Ionicons name="call" size={12} color={colors.primary} /> Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={() => handleDirections(lab.name, lab.address)}>
                <Text style={styles.actionText}>
                  <Ionicons name="map" size={12} color={colors.primary} /> Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {sortedLabs.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="flask"
            size={48}
            color={colors.textSecondary}
            style={{ marginBottom: 16 }}
          />
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
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: spacing.sm,
    },
    filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterIcon: { fontSize: 14, marginRight: spacing.xs },
    filterLabel: { ...typography.caption1, color: colors.text, fontWeight: '500' },
    filterLabelActive: { color: '#FFFFFF' },
    labCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    labHeader: { flexDirection: 'row', marginBottom: spacing.md },
    labTypeIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    labTypeEmoji: { fontSize: 20 },
    labInfo: { flex: 1, marginLeft: spacing.md },
    labNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
    labName: { ...typography.callout, color: colors.text, fontWeight: '600' },
    accreditedBadge: {
      backgroundColor: '#34C75915',
      paddingHorizontal: spacing.sm,
      paddingVertical: 1,
      borderRadius: radius.sm,
    },
    accreditedText: { ...typography.caption2, color: '#34C759', fontWeight: '700' },
    labAddress: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },
    labDistance: {
      ...typography.caption2,
      color: colors.textTertiary,
      marginTop: 4,
      fontWeight: '500',
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
      marginBottom: 2,
    },
    contactItemWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
    contactItemInfo: { ...typography.caption2, color: colors.textTertiary, marginLeft: 4 },
    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontSize: 10, fontWeight: 'bold' },
    servicesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginBottom: spacing.md,
      marginTop: spacing.sm,
    },
    serviceChip: {
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    serviceText: { ...typography.caption2, color: colors.textSecondary },
    actionsRow: { flexDirection: 'row', gap: spacing.sm },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionText: { ...typography.caption1, color: colors.primary, fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
    emptyIcon: { fontSize: 32, marginBottom: spacing.sm },
    emptyText: { ...typography.subhead, color: colors.textSecondary },
  });

export default React.memo(TestingLabs);
