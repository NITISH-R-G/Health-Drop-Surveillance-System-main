const fs = require('fs');
const filepath = 'pages/HygieneEducation.tsx';
let code = fs.readFileSync(filepath, 'utf8');

const oldDashboardCode = `  const renderDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Hygiene Academy</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'learn' && styles.tabActive]}
          onPress={() => setActiveTab('learn')}>
          <Text style={[styles.tabText, activeTab === 'learn' && styles.tabTextActive]}>
            Learn & Earn
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
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Total XP</Text>
            <Text style={styles.scoreValue}>{score}</Text>
            <View style={styles.rankBadge}>
              <Text style={styles.scoreRank}>Rank: Health Guardian</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: \`\${(score % 1000) / 10}%\` }]} />
            </View>
            <Text style={styles.progressText}>{1000 - (score % 1000)} XP to next rank</Text>
          </View>

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
                        { backgroundColor: unlocked ? badge.color + '20' : colors.surfaceVariant },
                      ]}>
                      <Text style={{ fontSize: 24 }}>{unlocked ? badge.icon : '🔒'}</Text>
                    </View>
                    <Text style={styles.badgeText}>{badge.name}</Text>
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
  );`;

const newDashboardCode = `  const handleModulePressCb = useCallback((mod: HygieneModule) => {
    handleModulePress(mod);
  }, [handleModulePress]);

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Hygiene Academy</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'learn' && styles.tabActive]}
          onPress={() => setActiveTab('learn')}>
          <Text style={[styles.tabText, activeTab === 'learn' && styles.tabTextActive]}>
            Learn & Earn
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

      {activeTab === 'learn' && (
        <>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Total XP</Text>
            <Text style={styles.scoreValue}>{score}</Text>
            <View style={styles.rankBadge}>
              <Text style={styles.scoreRank}>Rank: Health Guardian</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: \`\${(score % 1000) / 10}%\` }]} />
            </View>
            <Text style={styles.progressText}>{1000 - (score % 1000)} XP to next rank</Text>
          </View>

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
                        { backgroundColor: unlocked ? badge.color + '20' : colors.surfaceVariant },
                      ]}>
                      <Text style={{ fontSize: 24 }}>{unlocked ? badge.icon : '🔒'}</Text>
                    </View>
                    <Text style={styles.badgeText}>{badge.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={[styles.section, { paddingBottom: 0 }]}>
            <Text style={styles.sectionTitle}>Required Lessons</Text>
          </View>
        </>
      )}

      {activeTab === 'leaderboard' && (
        <View style={[styles.section, { paddingBottom: 0 }]}>
          <Text style={styles.sectionTitle}>Community Leaderboard</Text>
        </View>
      )}
    </View>
  );

  const renderDashboard = () => {
    const leaderboardDataList: LeaderboardEntry[] = leaderboardDataSync
      ? [...leaderboardDataSync]
      : [];

    const combinedLeaderboard = [
      ...leaderboardDataList,
      { id: 'user', name: 'You', points: score, avatar: '', isUser: true },
    ].sort((a, b) => b.points - a.points);

    return (
      <View style={styles.container}>
        <FlatList
          data={activeTab === 'learn' ? modules : combinedLeaderboard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader()}
          renderItem={({ item, index }) => {
            if (activeTab === 'learn') {
              const mod = item as HygieneModule;
              return <ModuleItem mod={mod} onPress={handleModulePressCb} />;
            } else {
              const entry = item as LeaderboardEntry;
              return <LeaderboardItem item={entry} index={index} />;
            }
          }}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };`;

code = code.replace(oldDashboardCode, newDashboardCode);

code = code.replace(
  `  const renderLeaderboard = () => {
    const leaderboardDataList: LeaderboardEntry[] = leaderboardDataSync
      ? [...leaderboardDataSync]
      : [];

    const combinedLeaderboard = [
      ...leaderboardDataList,
      { id: 'user', name: 'You', points: score, avatar: '', isUser: true },
    ].sort((a, b) => b.points - a.points);

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
                <Text style={{ fontSize: 20 }}>{item.avatar || '👤'}</Text>
              </View>
              <Text style={[styles.leaderboardName, item.isUser && styles.textActive]}>
                {item.name}
              </Text>
              <Text style={[styles.leaderboardScore, item.isUser && styles.textActive]}>
                {item.points} XP
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };`,
  ""
);

fs.writeFileSync(filepath, code);
