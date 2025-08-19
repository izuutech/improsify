import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {RewardBadge} from '../components/RewardBadge';
import {StatsCard} from '../components/StatsCard';
// 🔁 Replace context with Zustand store
import {useStore} from '../store/useStore';
import {theme} from '../styles/theme';

export const RewardsScreen: React.FC = () => {
  const {rewards, stats} = useStore(); // ✅ Zustand hook

  const unlockedRewards = rewards.filter(r => r.unlocked);
  const lockedRewards = rewards.filter(r => !r.unlocked);

  return (
    <ScrollView style={styles.container}>
      <StatsCard
        level={stats.level}
        currentXP={stats.currentLevelXP}
        xpToNextLevel={stats.xpToNextLevel}
        totalXP={stats.totalXP}
      />

      <Text style={styles.sectionTitle}>Your Achievements</Text>
      {unlockedRewards.length > 0 ? (
        <View style={styles.rewardsGrid}>
          {unlockedRewards.map(reward => (
            <RewardBadge
              key={reward.id}
              title={reward.title}
              description={reward.description}
              unlocked={true}
              icon={reward.icon}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No rewards unlocked yet. Keep going!
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Upcoming Rewards</Text>
      {lockedRewards.length > 0 ? (
        <View style={styles.rewardsGrid}>
          {lockedRewards.map(reward => (
            <RewardBadge
              key={reward.id}
              title={reward.title}
              description={reward.description}
              unlocked={false}
              icon={reward.icon}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You've unlocked all rewards! Amazing!
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 16,
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
});
