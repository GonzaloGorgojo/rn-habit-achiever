import { ICreateHabit, IHabit } from '../interfaces/dbInterfaces';

export const calculateHabitStats = (
  habitData: ICreateHabit,
  userId: number,
): IHabit => {
  const newHabit: IHabit = {
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
