import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProgressBar} from './ProgressBar';
import {useStore} from '../store/useStore';
import {theme} from '../styles/theme';
import {Habit} from '../types/types';

type HabitCardProps = {
  habit: Habit;
};

const Icon = MaterialCommunityIcons as any;
export const HabitCard: React.FC<HabitCardProps> = ({habit}) => {
  const completeHabit = useStore(state => state.completeHabit);

  const getDifficultyColor = () => {
    switch (habit.difficulty) {
      case 'easy':
        return theme.colors.success;
      case 'medium':
        return theme.colors.warning;
      case 'hard':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const handleComplete = () => {
    completeHabit(habit.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{habit.title}</Text>
        <View style={styles.rightContainer}>
          <View style={[styles.xpContainer]}>
            <Text style={styles.xpText}>+{habit.xp} XP</Text>
          </View>
          <View
            style={[
              styles.difficulty,
              {backgroundColor: getDifficultyColor()},
            ]}>
            <Text style={styles.difficultyText}>{habit.difficulty}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{habit.description}</Text>

      <View style={styles.streakContainer}>
        <Icon name="fire" size={20} color={theme.colors.accent} />
        <Text style={styles.streakText}>{habit.currentStreak} days</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.completeButton,
          habit.completedToday ? styles.completedButton : {},
        ]}
        onPress={handleComplete}
        disabled={habit.completedToday}>
        <Text style={styles.completeButtonText}>
          {habit.completedToday ? 'Completed' : 'Complete'}
        </Text>
      </TouchableOpacity>

      {habit.completedToday && (
        <ProgressBar
          progress={100}
          color={theme.colors.success}
          height={4}
          style={styles.progressBar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  difficulty: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakText: {
    fontSize: 14,
    color: theme.colors.accent,
    marginLeft: 4,
  },
  xpContainer: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  xpText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  completedButton: {
    backgroundColor: theme.colors.disabled,
  },
  completeButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  progressBar: {
    marginTop: 8,
  },
});
