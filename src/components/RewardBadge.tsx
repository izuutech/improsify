import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../styles/theme';

type RewardBadgeProps = {
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
};

export const RewardBadge: React.FC<RewardBadgeProps> = ({
  title,
  description,
  unlocked,
  icon,
}) => {
  return (
    <View
      style={[styles.container, unlocked ? styles.unlocked : styles.locked]}>
      <View style={styles.iconContainer}>
        <Icon
          name={icon}
          size={32}
          color={unlocked ? theme.colors.primary : theme.colors.disabled}
        />
      </View>
      <Text
        style={[styles.title, unlocked ? {} : {color: theme.colors.disabled}]}>
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          unlocked ? {} : {color: theme.colors.disabled},
        ]}>
        {description}
      </Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          {unlocked ? 'Unlocked!' : 'Locked'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: theme.roundness,
    margin: 8,
    width: 160,
    elevation: 2,
  },
  unlocked: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  locked: {
    backgroundColor: theme.colors.surface,
    opacity: 0.6,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
