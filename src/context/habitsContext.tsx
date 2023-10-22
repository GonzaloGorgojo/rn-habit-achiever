import { IHabit } from '@src/common/interfaces/dbInterfaces';
import { createContext, useContext, useState } from 'react';

type HabitsContextType = {
  children: React.ReactNode;
};

export interface IHabitsContext {
  userHabits: IHabit[] | [];
  setUserHabits: (h: IHabit[] | []) => void;
}

export const userHabitsContext = createContext<IHabitsContext>({
  userHabits: [],
  setUserHabits: () => [],
});

export const UserHabitsContextProvider = ({ children }: HabitsContextType) => {
  const [userHabits, setUserHabits] = useState<IHabit[] | []>([]);

  return (
    <userHabitsContext.Provider value={{ userHabits, setUserHabits }}>
      {children}
    </userHabitsContext.Provider>
  );
};

export const useUserHabitsContext = () => useContext(userHabitsContext);
