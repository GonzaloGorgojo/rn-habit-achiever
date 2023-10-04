import { StyleProp, ViewStyle } from 'react-native';

export interface IUser {
  id: number;
  name: string;
  active: number;
}

export interface IHabit {
  id: number;
  userId: number;
  habit: string;
  consecutiveDaysCompleted: number;
  maxConsecutiveDaysCompleted: number;
  habitReached: boolean;
  goal: number;
  ask: boolean;
}

export interface ICreateHabit {
  habit: string;
  goal: number;
}

export interface ICommonProps {
  style?: StyleProp<ViewStyle>;
}
