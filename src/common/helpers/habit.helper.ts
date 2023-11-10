import dayjs from 'dayjs';
import { ICreateHabit, IHabit, IHabitInput } from '../interfaces/dbInterfaces';
import { dateFormat } from '@src/common/constants/commonConstants';

export const calculateHabitStats = (
  habitData: ICreateHabit,
  userId: number,
): IHabitInput => {
  const newHabit: IHabitInput = {
    userId,
    habit: habitData.habit,
    consecutiveDaysCompleted: 0,
    maxConsecutiveDaysCompleted: 0,
    habitReached: 0,
    goal: habitData.goal,
    ask: 0,
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
    id: habitData.id,
    userId: habitData.userId,
    habit: habitData.habit,
    goal: habitData.goal,
    ask: habitData.ask,
    habitReached: habitData.consecutiveDaysCompleted >= habitData.goal ? 1 : 0,
    consecutiveDaysCompleted: habitData.consecutiveDaysCompleted,
    maxConsecutiveDaysCompleted: maxConsecutiveDayCalculation,
    isTodayCompleted: habitData.isTodayCompleted,
    todayDate: habitData.todayDate,
  };

  return updatedHabit;
};
