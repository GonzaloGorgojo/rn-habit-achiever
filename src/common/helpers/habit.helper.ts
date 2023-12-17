import dayjs from 'dayjs';
import { ICreateHabit, IHabit, IHabitInput } from '../interfaces/dbInterfaces';
import { dateFormat } from '@src/common/constants/commonConstants';

export const calculateNewHabitStats = (
  habitData: ICreateHabit,
  userId: number,
  ask: number,
  notificationId: string | null,
  notificationTime: string | null,
): IHabitInput => {
  const newHabit: IHabitInput = {
    userId,
    habit: habitData.habit,
    consecutiveDaysCompleted: 0,
    maxConsecutiveDaysCompleted: 0,
    habitReached: 0,
    goal: habitData.goal,
    ask: ask,
    notificationTime: notificationTime,
    notificationId: notificationId,
    todayDate: dayjs().format(dateFormat),
    isTodayCompleted: 0,
  };

  return newHabit;
};

export const calculateUpdateHabitStats = (
  oldData: IHabit,
  newData: ICreateHabit,
  userId: number,
  ask: number,
  notificationId: string | null,
  notificationTime: string | null,
): IHabit => {
  const updatedHabit: IHabit = {
    id: oldData.id,
    userId,
    habit: newData.habit,
    consecutiveDaysCompleted: oldData.consecutiveDaysCompleted,
    maxConsecutiveDaysCompleted: oldData.maxConsecutiveDaysCompleted,
    habitReached: oldData.habitReached,
    goal: newData.goal,
    ask: ask,
    notificationTime: notificationTime,
    notificationId: notificationId,
    todayDate: dayjs().format(dateFormat),
    isTodayCompleted: oldData.isTodayCompleted,
  };

  return updatedHabit;
};

export const calculateUpdatedHabitStats = (habitData: IHabit) => {
  const maxConsecutiveDayCalculation =
    habitData.maxConsecutiveDaysCompleted <= habitData.consecutiveDaysCompleted
      ? habitData.consecutiveDaysCompleted
      : habitData.maxConsecutiveDaysCompleted;

  const updatedHabit: IHabit = {
    ...habitData,
    habitReached: habitData.consecutiveDaysCompleted >= habitData.goal ? 1 : 0,
    maxConsecutiveDaysCompleted: maxConsecutiveDayCalculation,
  };

  return updatedHabit;
};
