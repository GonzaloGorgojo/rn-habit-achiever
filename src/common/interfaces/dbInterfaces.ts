import { StyleProp, ViewStyle } from 'react-native';

export interface IUser {
  id: number;
  name: string;
  active: number;
}

export interface IHabit {
  id?: number;
  userId: number;
  habit: string;
  consecutiveDaysCompleted: number;
  maxConsecutiveDaysCompleted: number;
  habitReached: number; //act as boolean = 0(false) or 1(true)
  goal: number;
  ask: number; //act as boolean = 0(false) or 1(true)
}

export interface ICreateHabit {
  habit: string;
  goal: number;
}

export interface ICommonProps {
  style?: StyleProp<ViewStyle>;
}
