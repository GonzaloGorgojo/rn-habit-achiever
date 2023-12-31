import { useUserHabitsContext } from '@src/context/habitsContext';
import { useActiveUserContext } from '@src/context/userContext';
import { database } from '@src/database/database';
import { useEffect, useState } from 'react';

export default function useSetupApp() {
  const [isDBLoadingComplete, setDBLoadingComplete] = useState<boolean>(false);
  const { setActiveUser } = useActiveUserContext();
  const { setUserHabits, setUserHabitsDates } = useUserHabitsContext();

  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        console.log('Setting Up the Database now...');
        //Line below is only for testing when you want to reset the database.
        // await database.dropDatabaseTablesAsync();

        await database.setupDatabase();
        const checkVersion = await database.isDatabaseUpToDate();

        if (!checkVersion) {
          await database.migrateDatabase();
        }
        const activeUser = await database.getActiveUser();
        setActiveUser(activeUser);
        if (activeUser) {
          const userHabits = await database.getUserHabits(activeUser.id);
          setUserHabits(userHabits);

          if (userHabits) {
            const userHabitsDates = await database.getUserHabitsDates(
              activeUser.id,
            );
            setUserHabitsDates(userHabitsDates);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setDBLoadingComplete(true);
      }
    };
    loadDataAsync();
  }, [setActiveUser, setUserHabits, setUserHabitsDates]);

  return isDBLoadingComplete;
}
