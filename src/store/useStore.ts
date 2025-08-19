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
          const habits = state.habits.map(habit => {
            if (habit.id === habitId) {
              const newStreak = habit.completedToday
                ? habit.currentStreak
                : habit.currentStreak + 1;
              const xpEarned = habit.xp * (habit.completedToday ? 0.5 : 1);

              get().updateStats(xpEarned);

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

          return {habits};
        }),

      addGoal: goal =>
        set(state => ({
          goals: [...state.goals, goal],
          stats: {
            ...state.stats,
            totalGoals: state.stats.totalGoals + 1,
          },
        })),

      updateGoalProgress: (goalId, progress) =>
        set(state => {
          const goals = state.goals.map(goal => {
            if (goal.id === goalId) {
              const isCompleted = progress >= 100 && !goal.completed;
              const xpEarned = isCompleted ? goal.xp : 0;

              if (isCompleted) {
                get().updateStats(xpEarned);
              }

              return {
                ...goal,
                progress,
                completed: progress >= 100,
              };
            }
            return goal;
          });

          return {goals};
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
              // Already logged in today – no update
              return {};
            }

            const diffInTime = today.getTime() - lastLogin.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

            if (diffInDays === 1) {
              loginStreak += 1; // continue streak
            } else {
              loginStreak = 1; // reset streak
            }
          } else {
            loginStreak = 1; // first time login
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
          const newTotalXP = state.stats.totalXP + xp;
          const currentLevelXP = state.stats.currentLevelXP + xp;

          let level = state.stats.level;
          let xpToNextLevel = state.stats.xpToNextLevel;
          let remainingXP = currentLevelXP;

          while (remainingXP >= xpToNextLevel) {
            remainingXP -= xpToNextLevel;
            level += 1;
            xpToNextLevel = Math.floor(xpToNextLevel * 1.2);
          }

          // Unlock rewards if possible
          state.rewards.forEach(reward => {
            if (!reward.unlocked && newTotalXP >= reward.xpCost) {
              get().unlockReward(reward.id);
            }
          });

          return {
            stats: {
              ...state.stats,
              totalXP: newTotalXP,
              level,
              currentLevelXP: remainingXP,
              xpToNextLevel,
              completedHabits: state.habits.filter(h => h.completedToday)
                .length,
              completedGoals: state.goals.filter(g => g.completed).length,
            },
          };
        }),
    }),
    {
      name: 'user-progress-storage', // unique name for storage key
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
