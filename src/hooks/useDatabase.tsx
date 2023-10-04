import { useActiveUserContext } from '@src/context/userContext';
import { database } from '@src/database/database';
import { useEffect, useState } from 'react';

export default function useDatabase() {
  const [isDBLoadingComplete, setDBLoadingComplete] = useState<boolean>(false);
  const { setActiveUser } = useActiveUserContext();

  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        database.getActiveUser(setActiveUser);
        // await database.dropDatabaseTablesAsync();
        await database.setupDatabase();
        setDBLoadingComplete(true);
      } catch (error) {
        console.log(error);
      }
    };
    loadDataAsync();
  }, [setActiveUser]);

  return isDBLoadingComplete;
}
