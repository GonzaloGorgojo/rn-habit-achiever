import { ICreateHabit, IHabitInput } from '../interfaces/dbInterfaces';

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
  };

  return newHabit;
};
