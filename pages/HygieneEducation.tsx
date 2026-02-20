import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

export interface HygieneModule {
  id: number;
  title: string;
  duration: string;
  points: number;
  completed: boolean;
}

interface HygieneEducationProps {
  onBack: () => void;
  modules: HygieneModule[];
  score: number;
  onUpdateModule: (id: number, points: number) => void;
}

const HygieneEducation: React.FC<HygieneEducationProps> = ({ onBack, modules, score, onUpdateModule }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeModule, setActiveModule] = useState<HygieneModule | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Dynamic Rank Calculation
  const getRank = (currentScore: number) => {
    if (currentScore >= 400) return 'WASH Master 👑';
    if (currentScore >= 200) return 'Hygiene Hero 🛡️';
    return 'Novice 🌱';
  };

  const currentRank = getRank(score);

  const handleModulePress = (mod: HygieneModule) => {
    if (mod.completed) {
      Alert.alert('Already Completed', 'You have already earned the points for this module, but you can review it anytime!');
    }
    setActiveModule(mod);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === 1) { // 1 is the hardcoded correct answer index for this mock
      Alert.alert('Correct! 🎉', `You earned ${activeModule?.points} XP and a new badge!`);
      if (activeModule && !activeModule.completed) {
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Lessons</Text>
        {modules.map(mod => (
          <TouchableOpacity
            key={mod.id}
            style={[styles.moduleCard, mod.completed && { borderColor: colors.success }]}
            onPress={() => handleModulePress(mod)}
          >
            <View style={[styles.iconBox, { backgroundColor: mod.completed ? colors.success : colors.surfaceVariant }]}>
              <Ionicons name={mod.completed ? "checkmark" : "play"} size={24} color={mod.completed ? "#fff" : colors.primary} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{mod.title}</Text>
              <Text style={styles.moduleMeta}>{mod.duration}  •  {mod.points} XP</Text>
            </View>
            {mod.completed && (
              <Ionicons name="ribbon" size={24} color={colors.warning} />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
          <Text style={styles.lessonDescription}>
            Learn the core principles of {activeModule?.title.toLowerCase()} to protect yourself and your family from water-borne diseases like Cholera and Typhoid.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setQuizMode(true)}>
            <Text style={styles.primaryButtonText}>I've finished reading ➔ Take Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.learningContent}>
          <Text style={styles.quizQuestion}>
            Which of the following is the most effective way to purify water at home during an outbreak?
          </Text>

          {['Using a clean cloth filter', 'Boiling water for at least 3 minutes', 'Adding salt and sugar', 'Leaving it in the sun for an hour'].map((ans, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quizOption,
                selectedAnswer === index && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
              ]}
              onPress={() => setSelectedAnswer(index)}
            >
              <View style={[styles.radioOuter, selectedAnswer === index && { borderColor: colors.primary }]}>
                {selectedAnswer === index && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={styles.quizOptionText}>{ans}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.primaryButton, selectedAnswer === null && { opacity: 0.5 }]}
            onPress={handleAnswerSubmit}
            disabled={selectedAnswer === null}
          >
            <Text style={styles.primaryButtonText}>Submit Answer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {activeModule ? renderLearningViewer() : renderDashboard()}
    </View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xl },
  backButton: { marginRight: spacing.md },
  title: { ...typography.title3, color: colors.text },

  scoreCard: { margin: spacing.lg, padding: spacing.xl, backgroundColor: colors.primary, borderRadius: radius.xl, alignItems: 'center', shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  scoreLabel: { ...typography.subhead, color: '#fff', opacity: 0.9, textTransform: 'uppercase', letterSpacing: 1 },
  scoreValue: { fontSize: 48, fontWeight: '800', color: '#fff', marginVertical: spacing.sm },
  rankBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full },
  scoreRank: { ...typography.headline, color: '#fff', fontWeight: '700' },

  section: { padding: spacing.lg },
  sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.md },
  moduleCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 2, borderColor: colors.border },
  iconBox: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  moduleInfo: { flex: 1 },
  moduleTitle: { ...typography.headline, color: colors.text, marginBottom: 2 },
  moduleMeta: { ...typography.caption2, color: colors.textSecondary, fontWeight: '600' },

  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg, paddingTop: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { ...typography.headline, color: colors.text },
  learningContent: { flex: 1, padding: spacing.lg },
  videoPlaceholder: { width: '100%', height: 220, backgroundColor: colors.surfaceVariant, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  videoText: { ...typography.subhead, color: colors.textSecondary, marginTop: spacing.sm },
  lessonDescription: { ...typography.body, color: colors.text, lineHeight: 24, marginBottom: spacing.xl },

  quizQuestion: { ...typography.title3, color: colors.text, marginBottom: spacing.xl, lineHeight: 28 },
  quizOption: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.border, marginBottom: spacing.md },
  radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.textTertiary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  quizOptionText: { ...typography.callout, color: colors.text, flex: 1 },

  primaryButton: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: radius.xl, alignItems: 'center', marginTop: 'auto' },
  primaryButtonText: { ...typography.headline, color: '#fff' }
});

export default HygieneEducation;