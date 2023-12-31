import dayjs from 'dayjs';
import { dateFormat } from '@src/common/constants/commonConstants';

import {
  ICreateHabit,
  IHabit,
  IHabitDate,
  IHabitInput,
} from '../interfaces/dbInterfaces';

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
  };

  return updatedHabit;
};

export const calculateCompletedHabitStats = (
  habitData: IHabit,
  habitDates: IHabitDate[] | [],
): IHabit => {
  const isNextDayResult = isNextDay(habitDates);

  habitData.consecutiveDaysCompleted = isNextDayResult
    ? habitData.consecutiveDaysCompleted + 1
    : 1;

  const maxConsecutiveDayCalculation =
    isNextDayResult &&
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

const isNextDay = (habitDates: IHabitDate[] | []): boolean => {
  try {
    if (habitDates && habitDates.length > 0) {
      // Compare if today is the next day from any of the habit dates
      const today = dayjs();
      const isImmediateNextDay = habitDates.some((date) =>
        today.isSame(dayjs(date.dateCompleted).add(1, 'day'), 'day'),
      );
      return isImmediateNextDay;
    }

    // If there are no habit dates, consider it as the next day
    return true;
  } catch (error) {
    console.error('Error checking if today is the next day:', error);
    return false;
  }
};

export const isTodayAmongHabitDates = (
  habitDates: IHabitDate[] | [],
): boolean => {
  try {
    if (habitDates && habitDates.length > 0) {
      // Check if today's date is among the habit dates
      const today = dayjs().format(dateFormat);
      const isTodayAmongDates = habitDates.some(
        (habitDate) => habitDate.dateCompleted === today,
      );

      return isTodayAmongDates;
    }

    // If there are no habit dates, consider it as today not being among dates
    return false;
  } catch (error) {
    console.error('Error checking if today is among habit dates:', error);
    return false;
  }
};
