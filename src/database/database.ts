import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import {
  IHabit,
  IHabitDate,
  IHabitInput,
  IUser,
} from '@src/common/interfaces/dbInterfaces';

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
  db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {});
  return db;
}

const db = openDatabase();

const dropDatabaseTablesAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'drop table IF EXISTS users',
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

      tx.executeSql(
        'drop table IF EXISTS habits',
        [],
        (_, result) => {
          console.log('habits table dropped');
          console.log(result);
          resolve(result);
        },
        (_, error): boolean => {
          console.error('error dropping habits table');
          reject(error);
          return true;
        },
      );

      tx.executeSql(
        'drop table IF EXISTS habits_dates',
        [],
        (_, result) => {
          console.log('habits_dates table dropped');
          console.log(result);
          resolve(result);
        },
        (_, error): boolean => {
          console.error('error dropping habits_dates table');
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
        console.log('Creating habits table in case not exists');
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, habit TEXT, consecutiveDaysCompleted INTEGER, maxConsecutiveDaysCompleted INTEGER, habitReached BOOLEAN, goal INTEGER, ask BOOLEAN, notificationTime TEXT, notificationId TEXT, isTodayCompleted BOOLEAN,todayDate date, CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE);',
        );
        console.log('Creating habits dates table in case not exists');
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS habits_dates (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, habitId INTEGER, dateCompleted date, CONSTRAINT fk_habit FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE);',
        );
        resolve(true);
      } catch (error) {
        console.error(error, 'Error creating users table');
        reject(error);
      }
    });
  });
};

//User operations
const getActiveUser = async (): Promise<IUser | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Getting active user');
        tx.executeSql(
          'select * from users where (active) = ? limit 1;',
          [1],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const activeUser: IUser = _array.find(
                (user: IUser) => user.active === 1,
              );
              if (activeUser) {
                console.log('Found active user: ', activeUser.name);
                resolve(activeUser);
              } else {
                console.log('No active user found');
                resolve(null);
              }
            }
            resolve(null);
          },
        );
      } catch (error) {
        console.error(error, 'error getting active user');
        reject(error);
      }
    });
  });
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

//Habits operations
const getUserHabits = async (userId: number): Promise<IHabit[] | []> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Getting user habits');
        tx.executeSql(
          'select * from habits where (userId) = ?;',
          [userId],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              resolve(_array);
            }
            resolve([]);
          },
        );
      } catch (error) {
        console.error(error, 'error getting user habits');
        reject(error);
      }
    });
  });
};

const insertUserHabit = async (habit: IHabitInput) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Inserting user habit');
        tx.executeSql(
          'insert into habits (userId, habit, consecutiveDaysCompleted, maxConsecutiveDaysCompleted, habitReached, goal, ask, notificationTime, notificationId, isTodayCompleted, todayDate) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            habit.userId,
            habit.habit,
            habit.consecutiveDaysCompleted,
            habit.maxConsecutiveDaysCompleted,
            habit.habitReached,
            habit.goal,
            habit.ask,
            habit.notificationTime,
            habit.notificationId,
            habit.isTodayCompleted,
            habit.todayDate,
          ],
          (_, { rows: { _array } }) => {
            resolve(_array);
          },
        );
      } catch (error) {
        console.error(error, 'error inserting user habit');
        reject(error);
      }
    });
  });
};

const deleteUserHabit = async (habitId: number) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Deleting user habit');
        tx.executeSql('delete from habits where id = ?', [habitId]);
        resolve(true);
      } catch (error) {
        console.error(error, 'error deleting user habit');
        reject(error);
      }
    });
  });
};

const updateUserHabit = async (habit: IHabit) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Updating user habit');
        tx.executeSql(
          'update habits set consecutiveDaysCompleted = ?, isTodayCompleted = ?, maxConsecutiveDaysCompleted = ?, habitReached = ? where id = ?;',
          [
            habit.consecutiveDaysCompleted,
            habit.isTodayCompleted,
            habit.maxConsecutiveDaysCompleted,
            habit.habitReached,
            habit.id,
          ],
        );
        console.log('Inserting user habit date');
        tx.executeSql(
          'insert into habits_dates (userId, habitId, dateCompleted) values (?, ?, ?)',
          [habit.userId, habit.id, habit.todayDate],
        );
        resolve(true);
      } catch (error) {
        console.error(error, 'error updating user habit');
        reject(error);
      }
    });
  });
};

const getUserHabitsDates = async (
  userId: number,
): Promise<IHabitDate[] | []> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Getting user habits dates');
        tx.executeSql(
          'select * from habits_dates where (userId) = ?;',
          [userId],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              resolve(_array);
            }
            resolve([]);
          },
        );
      } catch (error) {
        console.error(error, 'error getting user habits');
        reject(error);
      }
    });
  });
};

export const database = {
  setupDatabase,
  dropDatabaseTablesAsync,
  getActiveUser,
  insertUser,
  deleteUser,
  getUserHabits,
  insertUserHabit,
  deleteUserHabit,
  updateUserHabit,
  getUserHabitsDates,
};
