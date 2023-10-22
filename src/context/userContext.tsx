import { IUser } from '@src/common/interfaces/dbInterfaces';
import { createContext, useContext, useState } from 'react';

type ActiveUserContextType = {
  children: React.ReactNode;
};

export interface IUserContext {
  activeUser: IUser | null;
  setActiveUser: (u: IUser | null) => void;
}

export const ActiveUserContext = createContext<IUserContext>({
  activeUser: null,
  setActiveUser: () => {},
});

export const ActiveUserContextProvider = ({
  children,
}: ActiveUserContextType) => {
  const [activeUser, setActiveUser] = useState<IUser | null>(null);

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
};

export const useActiveUserContext = () => useContext(ActiveUserContext);
