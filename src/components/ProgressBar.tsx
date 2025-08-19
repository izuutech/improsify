import React from 'react';
import {View, StyleSheet} from 'react-native';
import {theme} from '../styles/theme';

type ProgressBarProps = {
  progress: number;
  color?: string;
  height?: number;
  style?: any;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = theme.colors.primary,
  height = 8,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, {height}, style]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.disabled,
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: theme.roundness,
  },
});
