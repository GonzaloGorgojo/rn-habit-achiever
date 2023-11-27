import dayjs from 'dayjs';
import { ICreateHabit, IHabit, IHabitInput } from '../interfaces/dbInterfaces';
import { dateFormat } from '@src/common/constants/commonConstants';

export const calculateHabitStats = (
  habitData: ICreateHabit,
  userId: number,
  ask: number,
  notificationId: string | null,
): IHabitInput => {
  const newHabit: IHabitInput = {
    userId,
    habit: habitData.habit,
    consecutiveDaysCompleted: 0,
    maxConsecutiveDaysCompleted: 0,
    habitReached: 0,
    goal: habitData.goal,
    ask: ask,
    notificationTime: habitData.notificationTime,
    notificationId: notificationId ?? null,
    todayDate: dayjs().format(dateFormat),
    isTodayCompleted: 0,
  };

  return newHabit;
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
