import { IUser } from '@src/common/interfaces/dbInterfaces';
import { createContext, useContext, useState } from 'react';

type ActiveUserContextType = {
  children: React.ReactNode;
};

export interface IUserContext {
  activeUser: IUser | null;
  setActiveUser: (u: IUser | null) => void;
  askForPermission: boolean;
  setAskForPermission: (b: boolean) => void;
}

export const ActiveUserContext = createContext<IUserContext>({
  activeUser: null,
  setActiveUser: () => {},
  askForPermission: true,
  setAskForPermission: () => {},
});

export const ActiveUserContextProvider = ({
  children,
}: ActiveUserContextType) => {
  const [activeUser, setActiveUser] = useState<IUser | null>(null);
  const [askForPermission, setAskForPermission] = useState<boolean>(true);

  return (
    <ActiveUserContext.Provider
      value={{
        activeUser,
        setActiveUser,
        askForPermission,
        setAskForPermission,
      }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
};

export const useActiveUserContext = () => useContext(ActiveUserContext);
