import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProgressBar} from './ProgressBar';
import {useStore} from '../store/useStore';
import {theme} from '../styles/theme';
import {Goal} from '../types/types';

type GoalCardProps = {
  goal: Goal;
};

const Icon = MaterialCommunityIcons as any;
export const GoalCard: React.FC<GoalCardProps> = ({goal}) => {
  const updateGoalProgress = useStore(state => state.updateGoalProgress);

  const handleProgress = () => {
    const newProgress = goal.progress + 25 > 100 ? 100 : goal.progress + 25;
    updateGoalProgress(goal.id, newProgress);
  };

  return (
    <View style={[styles.card, goal.completed ? styles.completedCard : {}]}>
      <View style={styles.header}>
        <Text style={styles.title}>{goal.title}</Text>
        {goal.completed && (
          <Icon name="check-circle" size={24} color={theme.colors.success} />
        )}
      </View>

      <Text style={styles.description}>{goal.description}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarWrapper}>
          <ProgressBar
            progress={goal.progress}
            color={goal.completed ? theme.colors.success : theme.colors.primary}
            height={8}
          />
        </View>
        <Text style={styles.progressText}>{goal.progress}%</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.xpContainer}>
          <Icon name="star" size={16} color={theme.colors.accent} />
          <Text style={styles.xpText}>+{goal.xp} XP</Text>
        </View>

        {goal.reward && (
          <View style={styles.rewardContainer}>
            <Icon name="gift" size={16} color={theme.colors.accent} />
            <Text style={styles.rewardText}>{goal.reward}</Text>
          </View>
        )}
      </View>

      {!goal.completed && (
        <TouchableOpacity
          style={styles.progressButton}
          onPress={handleProgress}>
          <Text style={styles.progressButtonText}>Add Progress</Text>
        </TouchableOpacity>
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
  completedCard: {
    opacity: 0.8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  description: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 14,
    color: theme.colors.accent,
    marginLeft: 4,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: theme.colors.accent,
    marginLeft: 4,
  },
  progressButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  progressButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});
