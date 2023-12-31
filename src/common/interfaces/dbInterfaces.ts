import { StyleProp, ViewStyle } from 'react-native';

export interface IUser {
  id: number;
  name: string;
  active: number; //act as boolean = 0(false) or 1(true)
}

export interface IHabitInput {
  userId: number;
  habit: string;
  consecutiveDaysCompleted: number;
  maxConsecutiveDaysCompleted: number;
  habitReached: number; //act as boolean = 0(false) or 1(true)
  goal: number;
  ask: number; //act as boolean = 0(false) or 1(true)
  notificationTime: string | null;
  notificationId: string | null;
}

export interface IHabit extends IHabitInput {
  id: number;
}

export interface ICreateHabit {
  habit: string;
  goal: number;
}

export interface ICommonProps {
  style?: StyleProp<ViewStyle>;
}

export interface IHabitDate {
  id: number;
  userId: number;
  habitId: number;
  dateCompleted: string;
}

export interface IHabitNotification {
  time: string | null;
  id: string | null;
}
