import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { IUser } from '@src/common/interfaces/dbInterfaces';

export function openDatabase() {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase('habitachiever.db');
  return db;
}

const db = openDatabase();

const dropDatabaseTablesAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'drop table users',
        [],
        (_, result) => {
          console.log('users table dropped');
          console.log(result);
          resolve(result);
        },
        (_, error): boolean => {
          console.error('error dropping users table');
          reject(error);
          return true;
        },
      );
    });
  });
};

const setupDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Creating users table in case not exists');
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, active boolean);',
        );
        resolve(true);
      } catch (error) {
        console.error(error, 'Error creating users table');
        reject(error);
      }
    });
  });
};

const getActiveUser = (setActiveUser: (user: IUser) => void) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        'select * from users where (active) = ? limit 1;',
        [1],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const activeUser: IUser = _array.find(
              (user: IUser) => user.active === 1,
            );
            setActiveUser(activeUser);
          }
        },
      );
    });
  } catch (error) {
    console.error('error getting active user:', error);
  }
};

const insertUser = (userName: string) => {
  try {
    //delete users from table
    db.transaction((tx) => {
      tx.executeSql('delete from users');
    });

    db.transaction((tx) => {
      tx.executeSql('insert into users (name, active) values (?, 1)', [
        userName,
      ]);
    });
  } catch (error) {
    console.error('error inserting user:', error);
  }
};

const deleteUser = (userId: number) => {
  try {
    db.transaction((tx) => {
      tx.executeSql('delete from users where id = ?', [userId]);
    });
  } catch (error) {
    console.error('error deleting user:', error);
  }
};

export const database = {
  setupDatabase,
  dropDatabaseTablesAsync,
  getActiveUser,
  insertUser,
  deleteUser,
};
