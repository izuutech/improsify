import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ProgressBar} from './ProgressBar';
import {theme} from '../styles/theme';

type StatsCardProps = {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
};

export const StatsCard: React.FC<StatsCardProps> = ({
  level,
  currentXP,
  xpToNextLevel,
  totalXP,
}) => {
  const progress = (currentXP / xpToNextLevel) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.xpText}>
          {currentXP} / {xpToNextLevel} XP
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        color={theme.colors.primary}
        height={12}
        style={styles.progressBar}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total XP: {totalXP}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  xpText: {
    fontSize: 16,
    color: theme.colors.accent,
  },
  progressBar: {
    marginBottom: 8,
  },
  totalContainer: {
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
});
