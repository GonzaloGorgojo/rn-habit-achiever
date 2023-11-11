import { IHabit, IHabitDate } from '@src/common/interfaces/dbInterfaces';
import { createContext, useContext, useState } from 'react';

type HabitsContextType = {
  children: React.ReactNode;
};

export interface IHabitsContext {
  userHabits: IHabit[] | [];
  setUserHabits: (h: IHabit[] | []) => void;
  userHabitsDates: IHabitDate[] | [];
  setUserHabitsDates: (h: IHabitDate[] | []) => void;
}

export const userHabitsContext = createContext<IHabitsContext>({
  userHabits: [],
  setUserHabits: () => [],
  userHabitsDates: [],
  setUserHabitsDates: () => [],
});

export const UserHabitsContextProvider = ({ children }: HabitsContextType) => {
  const [userHabits, setUserHabits] = useState<IHabit[] | []>([]);
  const [userHabitsDates, setUserHabitsDates] = useState<IHabitDate[] | []>([]);

  return (
    <userHabitsContext.Provider
      value={{ userHabits, setUserHabits, userHabitsDates, setUserHabitsDates }}
    >
      {children}
    </userHabitsContext.Provider>
  );
};

export const useUserHabitsContext = () => useContext(userHabitsContext);
