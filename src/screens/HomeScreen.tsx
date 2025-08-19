import React, {useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {StatsCard} from '../components/StatsCard';
import {StreakCounter} from '../components/StreakCounter';
import {HabitCard} from '../components/HabitCard';
import {GoalCard} from '../components/GoalCard';
import {useStore} from '../store/useStore';
import {theme} from '../styles/theme';

export const HomeScreen: React.FC = () => {
  const stats = useStore(state => state.stats);
  const {updateLoginStreak, resetStore} = useStore(state => state);
  const habits = useStore(state => state.habits);
  const goals = useStore(state => state.goals);

  const recentHabits = habits.slice(0, 3);
  const activeGoals = goals.filter(g => !g.completed).slice(0, 2);

  useEffect(() => {
    // resetStore();
    updateLoginStreak();
  }, [stats]);

  return (
    <ScrollView style={styles.container}>
      <StatsCard
        level={stats.level}
        currentXP={stats.currentLevelXP}
        xpToNextLevel={stats.xpToNextLevel}
        totalXP={stats.totalXP}
      />

      <View style={styles.streakRow}>
        <StreakCounter
          count={stats.loginStreak}
          title="Login Streak"
          icon="login"
        />
        <StreakCounter
          count={stats.completedHabits}
          title="Habits Today"
          icon="check"
        />
        <StreakCounter
          count={stats.completedGoals}
          title="Goals Done"
          icon="flag"
        />
      </View>

      <Text style={styles.sectionTitle}>Recent Habits</Text>
      {recentHabits.map(habit => (
        <HabitCard key={habit.id} habit={habit} />
      ))}

      <Text style={styles.sectionTitle}>Active Goals</Text>
      {activeGoals.map(goal => (
        <GoalCard key={goal.id} goal={goal} />
      ))}

      {activeGoals.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No active goals. Add some to get started!
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
    paddingBottom: 50,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 8,
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
