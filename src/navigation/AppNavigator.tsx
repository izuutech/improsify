import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HomeScreen} from '../screens/HomeScreen';
import {HabitsScreen} from '../screens/HabitsScreen';
import {GoalsScreen} from '../screens/GoalsSceen';
import {RewardsScreen} from '../screens/RewardsScreen';
import {theme} from '../styles/theme';
import {useStore} from 'zustand';

const Tab = createBottomTabNavigator();

const Icon = MaterialCommunityIcons as any;
export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.text,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="flag-checkered" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="trophy" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
