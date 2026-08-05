import React, { useMemo, useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { HygieneModule, LeaderboardEntry } from '../types/models';
import { useSyncData } from '../lib/sync';

interface HygieneEducationProps {
  onBack: () => void;
  modules: HygieneModule[];
  score: number;
  onUpdateModule: (id: number, points: number) => void;
}

const HygieneEducation: React.FC<HygieneEducationProps> = ({
  onBack,
  modules,
  score,
  onUpdateModule,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeModule, setActiveModule] = useState<HygieneModule | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'leaderboard'>('learn');

  // Dynamic Rank Calculation
  const getRank = (currentScore: number) => {
    if (currentScore >= 400) return 'WASH Master 👑';
    if (currentScore >= 200) return 'Hygiene Hero 🛡️';
    return 'Novice 🌱';
  };

  const currentRank = getRank(score);

  const badges = [
    { id: 1, name: 'Novice', icon: 'leaf', threshold: 0, color: '#34C759' },
    { id: 2, name: 'Learner', icon: 'book', threshold: 100, color: '#5856D6' },
    { id: 3, name: 'Protector', icon: 'shield-checkmark', threshold: 200, color: '#007AFF' },
    { id: 4, name: 'Master', icon: 'trophy', threshold: 400, color: '#FF9500' },
  ];

  const nextBadge = badges.find((b) => b.threshold > score);
  const currentBadge = [...badges].reverse().find((b) => b.threshold <= score) || badges[0];
  const progressToNext = nextBadge
    ? ((score - currentBadge.threshold) / (nextBadge.threshold - currentBadge.threshold)) * 100
    : 100;

  const { data: leaderboardDataSync } = useSyncData('leaderboardData');

  const handleModulePress = (mod: HygieneModule) => {
    if (mod.completed) {
      Alert.alert(
        'Already Completed',
        'You have already earned the points for this module, but you can review it anytime!'
      );
    }
    setActiveModule(mod);
  };

  const handleAnswerSubmit = () => {
    if (activeModule && selectedAnswer === activeModule.correctAnswerIndex) {
      Alert.alert('Correct! 🎉', `You earned ${activeModule?.points} XP and a new badge!`);
      if (!activeModule.completed) {
        onUpdateModule(activeModule.id, activeModule.points);
      }
      setActiveModule(null);
      setQuizMode(false);
      setSelectedAnswer(null);
    } else {
      Alert.alert('Oops!', 'That is not the correct answer. Review the material and try again.');
      setSelectedAnswer(null);
    }
  };

  const renderLeaderboard = () => {
    const leaderboardDataList: LeaderboardEntry[] = leaderboardDataSync
      ? [...leaderboardDataSync]
      : [];

    const combinedLeaderboard = [
      { id: 'user', name: 'You', score: score, avatar: '👤', isUser: true },
      ...leaderboardDataList,
    ].sort((a, b) => b.score - a.score);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Leaderboard</Text>
        <View style={styles.leaderboardCard}>
          {combinedLeaderboard.map((item, index) => (
            <View
              key={item.id}
              style={[styles.leaderboardRow, item.isUser && styles.leaderboardRowActive]}>
              <Text style={[styles.rankText, item.isUser && styles.textActive]}>{index + 1}</Text>
              <View style={styles.avatarCircle}>
                <Text style={{ fontSize: 20 }}>{item.avatar}</Text>
              </View>
              <Text style={[styles.leaderboardName, item.isUser && styles.textActive]}>
                {item.name}
              </Text>
              <Text style={[styles.leaderboardScore, item.isUser && styles.textActive]}>
                {item.score} XP
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Hygiene Academy</Text>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Total Experience</Text>
        <Text style={styles.scoreValue}>{score} XP</Text>
        <View style={styles.rankBadge}>
          <Text style={styles.scoreRank}>{currentRank}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${Math.min(progressToNext, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {nextBadge
            ? `${Math.round(nextBadge.threshold - score)} XP to ${nextBadge.name}`
            : 'Max Rank Achieved!'}
        </Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'learn' && styles.tabActive]}
          onPress={() => setActiveTab('learn')}>
          <Text style={[styles.tabText, activeTab === 'learn' && styles.tabTextActive]}>
            My Learning
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'leaderboard' && styles.tabActive]}
          onPress={() => setActiveTab('leaderboard')}>
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.tabTextActive]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'learn' ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Badges</Text>
            <View style={styles.badgeGrid}>
              {badges.map((badge) => {
                const unlocked = score >= badge.threshold;
                return (
                  <View key={badge.id} style={[styles.badgeItem, !unlocked && styles.badgeLocked]}>
                    <View
                      style={[
                        styles.badgeIconCircle,
                        { backgroundColor: unlocked ? badge.color : colors.surfaceVariant },
                      ]}>
                      <Ionicons
                        name={badge.icon as any}
                        size={24}
                        color={unlocked ? '#FFF' : colors.textTertiary}
                      />
                    </View>
                    <Text style={[styles.badgeText, !unlocked && { color: colors.textTertiary }]}>
                      {badge.name}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Lessons</Text>
            {modules.map((mod) => (
              <TouchableOpacity
                key={mod.id}
                style={[styles.moduleCard, mod.completed && { borderColor: colors.success }]}
                onPress={() => handleModulePress(mod)}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: mod.completed ? colors.success : colors.surfaceVariant },
                  ]}>
                  <Ionicons
                    name={mod.completed ? 'checkmark' : 'play'}
                    size={24}
                    color={mod.completed ? '#fff' : colors.primary}
                  />
                </View>
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleTitle}>{mod.title}</Text>
                  <Text style={styles.moduleMeta}>
                    {mod.duration} • {mod.points} XP
                  </Text>
                </View>
                {mod.completed && <Ionicons name="ribbon" size={24} color={colors.warning} />}
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        renderLeaderboard()
      )}
    </ScrollView>
  );

  const renderLearningViewer = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => setActiveModule(null)}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{activeModule?.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      {!quizMode ? (
        <View style={styles.learningContent}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={80} color={colors.primary} />
            <Text style={styles.videoText}>Interactive Presentation Playing...</Text>
          </View>
          <Text style={styles.lessonDescription}>{activeModule?.description}</Text>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setQuizMode(true)}>
            <Text style={styles.primaryButtonText}>I've finished reading ➔ Take Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.learningContent}>
          <Text style={styles.quizQuestion}>{activeModule?.quizQuestion}</Text>

          {activeModule?.quizOptions.map((ans, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quizOption,
                selectedAnswer === index && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + '10',
                },
              ]}
              onPress={() => setSelectedAnswer(index)}>
              <View
                style={[
                  styles.radioOuter,
                  selectedAnswer === index && { borderColor: colors.primary },
                ]}>
                {selectedAnswer === index && (
                  <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={styles.quizOptionText}>{ans}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.primaryButton, selectedAnswer === null && { opacity: 0.5 }]}
            onPress={handleAnswerSubmit}
            disabled={selectedAnswer === null}>
            <Text style={styles.primaryButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>{activeModule ? renderLearningViewer() : renderDashboard()}</View>
  );
};

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      paddingTop: spacing.xl,
    },
    backButton: { marginRight: spacing.md },
    title: { ...typography.title3, color: colors.text },

    scoreCard: {
      margin: spacing.lg,
      padding: spacing.xl,
      backgroundColor: colors.primary,
      borderRadius: radius.xl,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    scoreLabel: {
      ...typography.subhead,
      color: '#fff',
      opacity: 0.9,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    scoreValue: { fontSize: 48, fontWeight: '800', color: '#fff', marginVertical: spacing.sm },
    rankBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
    },
    scoreRank: { ...typography.headline, color: '#fff', fontWeight: '700' },
    progressContainer: {
      width: '100%',
      height: 6,
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 3,
      marginTop: spacing.lg,
      overflow: 'hidden',
    },
    progressBar: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
    progressText: { ...typography.caption2, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },

    badgeGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
    badgeItem: { alignItems: 'center', width: '22%' },
    badgeLocked: { opacity: 0.6 },
    badgeIconCircle: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    badgeText: {
      ...typography.caption2,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },

    section: { padding: spacing.lg },
    sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.md },
    moduleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      borderWidth: 2,
      borderColor: colors.border,
    },
    iconBox: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    moduleInfo: { flex: 1 },
    moduleTitle: { ...typography.headline, color: colors.text, marginBottom: 2 },
    moduleMeta: { ...typography.caption2, color: colors.textSecondary, fontWeight: '600' },

    modalContainer: { flex: 1, backgroundColor: colors.background },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      paddingTop: spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: { ...typography.headline, color: colors.text },
    learningContent: { flex: 1, padding: spacing.lg },
    videoPlaceholder: {
      width: '100%',
      height: 220,
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    videoText: { ...typography.subhead, color: colors.textSecondary, marginTop: spacing.sm },
    lessonDescription: {
      ...typography.body,
      color: colors.text,
      lineHeight: 24,
      marginBottom: spacing.xl,
    },

    quizQuestion: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.xl,
      lineHeight: 28,
    },
    quizOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    radioOuter: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.textTertiary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    radioInner: { width: 12, height: 12, borderRadius: 6 },
    quizOptionText: { ...typography.callout, color: colors.text, flex: 1 },

    primaryButton: {
      backgroundColor: colors.primary,
      padding: spacing.lg,
      borderRadius: radius.xl,
      alignItems: 'center',
      marginTop: 'auto',
    },
    primaryButtonText: { ...typography.headline, color: '#fff' },

    // Leaderboard & Tabs
    tabContainer: {
      flexDirection: 'row',
      padding: spacing.md,
      marginHorizontal: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tabButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: radius.md,
    },
    tabActive: { backgroundColor: colors.primary + '20' },
    tabText: { ...typography.subhead, color: colors.textSecondary, fontWeight: '600' },
    tabTextActive: { color: colors.primary },
    leaderboardCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    leaderboardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    leaderboardRowActive: { backgroundColor: colors.primary + '10' },
    rankText: { ...typography.headline, width: 30, color: colors.textSecondary, fontWeight: '700' },
    avatarCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    leaderboardName: { ...typography.body, flex: 1, color: colors.text, fontWeight: '600' },
    leaderboardScore: { ...typography.subhead, color: colors.primary, fontWeight: '700' },
    textActive: { color: colors.primary },
  });

const ModuleItem = React.memo(
  ({ mod, onPress }: { mod: HygieneModule; onPress: (mod: HygieneModule) => void }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
      <View style={{ paddingHorizontal: spacing.lg }}>
        <TouchableOpacity
          style={[styles.moduleCard, mod.completed && { borderColor: colors.success }]}
          onPress={() => onPress(mod)}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: mod.completed ? colors.success : colors.surfaceVariant },
            ]}>
            <Ionicons
              name={mod.completed ? 'checkmark' : 'play'}
              size={24}
              color={mod.completed ? '#fff' : colors.primary}
            />
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>{mod.title}</Text>
            <Text style={styles.moduleMeta}>
              {mod.duration} • {mod.points} XP
            </Text>
          </View>
          {mod.completed && <Ionicons name="ribbon" size={24} color={colors.warning} />}
        </TouchableOpacity>
      </View>
    );
  }
);

const LeaderboardItem = React.memo(
  ({ item, index }: { item: LeaderboardEntry & { isUser?: boolean }; index: number }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
      <View style={{ paddingHorizontal: spacing.lg }}>
        <View
          style={[
            styles.leaderboardRow,
            item.isUser && styles.leaderboardRowActive,
            index === 0 && {
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: colors.border,
            },
            { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
            { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
          ]}>
          <Text style={[styles.rankText, item.isUser && styles.textActive]}>{index + 1}</Text>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 20 }}>{item.avatar || '👤'}</Text>
          </View>
          <Text style={[styles.leaderboardName, item.isUser && styles.textActive]}>
            {item.name}
          </Text>
          <Text style={[styles.leaderboardScore, item.isUser && styles.textActive]}>
            {item.score} XP
          </Text>
        </View>
      </View>
    );
  }
);

export default HygieneEducation;
