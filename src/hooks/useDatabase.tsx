import { useUserHabitsContext } from '@src/context/habitsContext';
import { useActiveUserContext } from '@src/context/userContext';
import { database } from '@src/database/database';
import { useEffect, useState } from 'react';

export default function useDatabase() {
  const [isDBLoadingComplete, setDBLoadingComplete] = useState<boolean>(false);
  const { setActiveUser } = useActiveUserContext();
  const { setUserHabits } = useUserHabitsContext();

  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        //Line below is only for testing when you want to reset the database.
        // await database.dropDatabaseTablesAsync();
        await database.setupDatabase();
        const activeUser = await database.getActiveUser();
        setActiveUser(activeUser);
        if (activeUser) {
          const userHabits = await database.getUserHabits(activeUser.id);
          setUserHabits(userHabits);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setDBLoadingComplete(true);
      }
    };
    loadDataAsync();
  }, [setActiveUser, setUserHabits]);

  return isDBLoadingComplete;
}
