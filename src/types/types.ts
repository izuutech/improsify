export type Habit = {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  lastCompleted?: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  targetDate?: Date;
  completed: boolean;
  progress: number;
  xp: number;
  reward?: string;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  xpCost: number;
  unlocked: boolean;
  icon: string;
};

export type UserStats = {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  totalHabits: number;
  completedHabits: number;
  totalGoals: number;
  completedGoals: number;
  loginStreak: number;
  lastLoginDate?: string;
};
