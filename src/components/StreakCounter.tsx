import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../styles/theme';

type StreakCounterProps = {
  count: number;
  title: string;
  icon: string;
};

const Icon = MaterialCommunityIcons as any;

export const StreakCounter: React.FC<StreakCounterProps> = ({
  count,
  title,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    margin: 8,
    minWidth: 100,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: theme.colors.primary + '20',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  title: {
    fontSize: 12,
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
});
