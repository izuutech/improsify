import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {Habit, Goal, Reward, UserStats} from '../types/types';

type Store = {
  habits: Habit[];
  goals: Goal[];
  rewards: Reward[];
  stats: UserStats;
  addHabit: (habit: Habit) => void;
  completeHabit: (habitId: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  unlockReward: (rewardId: string) => void;
  updateLoginStreak: () => void;
  updateStats: (xp: number) => void;
  resetStore: () => void;
};

const initialStats: UserStats = {
  totalXP: 0,
  level: 1,
  currentLevelXP: 0,
  xpToNextLevel: 1000,
  totalHabits: 0,
  completedHabits: 0,
  totalGoals: 0,
  completedGoals: 0,
  loginStreak: 0,
  lastLoginDate: '',
};

const initialRewards: Reward[] = [
  {
    id: '1',
    title: 'Novice Achiever',
    description: 'Complete your first habit',
    xpCost: 100,
    unlocked: false,
    icon: 'trophy',
  },
  {
    id: '2',
    title: 'Streak Starter',
    description: 'Maintain a 3-day streak',
    xpCost: 300,
    unlocked: false,
    icon: 'fire',
  },
  {
    id: '3',
    title: 'Goal Getter',
    description: 'Complete your first goal',
    xpCost: 500,
    unlocked: false,
    icon: 'flag-checkered',
  },
  {
    id: '4',
    title: 'Habit Hero',
    description: 'Complete 10 habits',
    xpCost: 1000,
    unlocked: false,
    icon: 'shield',
  },
];

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      habits: [],
      goals: [],
      rewards: initialRewards,
      stats: initialStats,

      addHabit: habit =>
        set(state => ({
          habits: [...state.habits, habit],
          stats: {
            ...state.stats,
            totalHabits: state.stats.totalHabits + 1,
          },
        })),

      completeHabit: habitId =>
        set(state => {
          let completedCountIncrement = 0;
          let xpEarned = 0;

          const habits = state.habits.map(habit => {
            if (habit.id === habitId) {
              const newStreak = habit.completedToday
                ? habit.currentStreak
                : habit.currentStreak + 1;
              xpEarned = habit.xp * (habit.completedToday ? 0.5 : 1);

              if (!habit.completedToday) {
                completedCountIncrement = 1;
              }

              return {
                ...habit,
                completedToday: true,
                lastCompleted: new Date(),
                currentStreak: newStreak,
                longestStreak: Math.max(habit.longestStreak, newStreak),
              };
            }
            return habit;
          });

          const updatedStats = computeUpdatedStats(
            state.stats,
            xpEarned,
            state.rewards,
          );

          return {
            habits,
            stats: {
              ...updatedStats,
              completedHabits:
                updatedStats.completedHabits + completedCountIncrement,
            },
            rewards: unlockEligibleRewards(state.rewards, updatedStats.totalXP),
          };
        }),

      addGoal: goal =>
        set(state => ({
          goals: [...state.goals, goal],
          stats: {
            ...state.stats,
            totalGoals: state.stats.totalGoals + 1,
          },
        })),

      updateGoalProgress: (goalId, newProgress) =>
        set(state => {
          let completedCountIncrement = 0;
          let xpEarned = 0;

          const goals = state.goals.map(goal => {
            if (goal.id === goalId) {
              const previousProgress = goal.progress;
              const clampedProgress = Math.min(newProgress, 100);
              const progressDelta = Math.max(
                clampedProgress - previousProgress,
                0,
              );

              xpEarned = (progressDelta / 100) * goal.xp;

              const isCompleted = clampedProgress >= 100 && !goal.completed;
              if (isCompleted) {
                completedCountIncrement = 1;
              }

              return {
                ...goal,
                progress: clampedProgress,
                completed: clampedProgress >= 100,
              };
            }
            return goal;
          });

          const updatedStats = computeUpdatedStats(
            state.stats,
            xpEarned,
            state.rewards,
          );

          return {
            goals,
            stats: {
              ...updatedStats,
              completedGoals:
                updatedStats.completedGoals + completedCountIncrement,
            },
            rewards: unlockEligibleRewards(state.rewards, updatedStats.totalXP),
          };
        }),

      unlockReward: rewardId =>
        set(state => ({
          rewards: state.rewards.map(reward => {
            if (
              reward.id === rewardId &&
              !reward.unlocked &&
              state.stats.totalXP >= reward.xpCost
            ) {
              return {
                ...reward,
                unlocked: true,
              };
            }
            return reward;
          }),
        })),

      updateLoginStreak: () =>
        set(state => {
          const lastLogin = state.stats.lastLoginDate
            ? new Date(state.stats.lastLoginDate)
            : null;
          const today = new Date();
          const todayStr = today.toISOString().split('T')[0];

          let loginStreak = state.stats.loginStreak;

          if (lastLogin) {
            const lastLoginStr = lastLogin.toISOString().split('T')[0];

            if (lastLoginStr === todayStr) {
              return {}; // Already logged in today
            }

            const diffInTime = today.getTime() - lastLogin.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

            if (diffInDays === 1) {
              loginStreak += 1;
            } else {
              loginStreak = 1;
            }
          } else {
            loginStreak = 1;
          }

          return {
            stats: {
              ...state.stats,
              loginStreak,
              lastLoginDate: today.toISOString(),
            },
          };
        }),

      updateStats: xp =>
        set(state => {
          const updatedStats = computeUpdatedStats(
            state.stats,
            xp,
            state.rewards,
          );
          return {
            stats: updatedStats,
            rewards: unlockEligibleRewards(state.rewards, updatedStats.totalXP),
          };
        }),

      resetStore: () =>
        set(() => ({
          habits: [],
          goals: [],
          rewards: initialRewards,
          stats: initialStats,
        })),
    }),
    {
      name: 'user-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// 🔧 Utility: Level progression and XP tracking
function computeUpdatedStats(
  stats: UserStats,
  xpGained: number,
  rewards: Reward[],
): UserStats {
  let newTotalXP = stats.totalXP + xpGained;
  let currentLevelXP = stats.currentLevelXP + xpGained;
  let level = stats.level;
  let xpToNextLevel = stats.xpToNextLevel;

  while (currentLevelXP >= xpToNextLevel) {
    currentLevelXP -= xpToNextLevel;
    level += 1;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.2);
  }

  return {
    ...stats,
    totalXP: newTotalXP,
    currentLevelXP,
    level,
    xpToNextLevel,
  };
}

// 🔓 Utility: Unlock rewards based on XP
function unlockEligibleRewards(rewards: Reward[], totalXP: number): Reward[] {
  return rewards.map(reward => {
    if (!reward.unlocked && totalXP >= reward.xpCost) {
      return {...reward, unlocked: true};
    }
    return reward;
  });
}
