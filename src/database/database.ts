import dayjs from 'dayjs';
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import {
  IHabit,
  IHabitDate,
  IHabitInput,
  IUser,
} from '@src/common/interfaces/dbInterfaces';
import { DB_VERSION, dateFormat } from '@src/common/constants/commonConstants';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
//Db operations
function openDatabase() {
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
          resolve(result);
        },
        (_, error): boolean => {
          console.error('error dropping habits_dates table');
          reject(error);
          return true;
        },
      );

      tx.executeSql(
        'drop table IF EXISTS version',
        [],
        (_, result) => {
          console.log('version table dropped');
          resolve(result);
        },
        (_, error): boolean => {
          console.error('error dropping version table');
          reject(error);
          return true;
        },
      );
    });
  });
};

const setupDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      console.log('Creating users table in case not exists');
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, active boolean);',
        [],
        () => {
          console.log('Users table created successfully');
        },
        (_, error) => {
          console.error('Error creating users table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      console.log('Creating habits table in case not exists');
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, habit TEXT, consecutiveDaysCompleted INTEGER, maxConsecutiveDaysCompleted INTEGER, habitReached BOOLEAN, goal INTEGER, ask BOOLEAN, notificationTime TEXT, notificationId TEXT, CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE);',
        [],
        () => {
          console.log('Habits table created successfully');
        },
        (_, error) => {
          console.error('Error creating habits table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      console.log('Creating habits dates table in case not exists');
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habits_dates (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, habitId INTEGER, dateCompleted date, CONSTRAINT fk_habit FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE);',
        [],
        () => {
          console.log('Habits dates table created successfully');
          resolve(true);
        },
        (_, error) => {
          console.error('Error creating habits dates table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      console.log('Creating version table in case not exists');
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS version (id INTEGER PRIMARY KEY AUTOINCREMENT, version INTEGER DEFAULT 1);',
        [],
        () => {
          console.log('version table created successfully');
          tx.executeSql(
            'INSERT INTO version (version) VALUES (1);',
            [],
            () => {
              console.log('Record inserted into version table successfully');
              resolve(true);
            },
            (_, error) => {
              console.error(
                'Error inserting record into version table:',
                error,
              );
              reject(error);
              return false; // Prevent the transaction from continuing
            },
          );
          resolve(true);
        },
        (_, error) => {
          console.error('Error creating version table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );
    });
  });
};

const isDatabaseUpToDate = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Fetch the current version from the version table
      tx.executeSql(
        'SELECT * FROM version;',
        [],
        (_, result) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const currentVersion = result.rows.item(0)?.version || 0;
          console.log('User Database Version:', currentVersion);
          console.log('APP Database Version:', DB_VERSION);

          if (currentVersion === DB_VERSION) {
            console.log('Database is up to date');
            resolve(true);
          } else {
            console.log('Database needs migration');
            resolve(false);
          }
        },
        (_, error) => {
          console.error('Error fetching database version:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );
    });
  });
};

const migrateDatabase = () => {
  console.log('Migrating database...');
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Step 1: Create new tables with a suffix
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users_new (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, active boolean);',
        [],
        () => {
          console.log('New users table created successfully');
        },
        (_, error) => {
          console.error('Error creating new users table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habits_new (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, habit TEXT, consecutiveDaysCompleted INTEGER, maxConsecutiveDaysCompleted INTEGER, habitReached BOOLEAN, goal INTEGER, ask BOOLEAN, notificationTime TEXT, notificationId TEXT, CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users_new(id) ON DELETE CASCADE);',
        [],
        () => {
          console.log('New habits table created successfully');
        },
        (_, error) => {
          console.error('Error creating new habits table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habits_dates_new (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, habitId INTEGER, dateCompleted DATE, CONSTRAINT fk_habit FOREIGN KEY (habitId) REFERENCES habits_new(id) ON DELETE CASCADE);',
        [],
        () => {
          console.log('New habits_dates table created successfully');
        },
        (_, error) => {
          console.error('Error creating new habits_dates table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      // Step 2: Copy data from old tables to the new tables
      tx.executeSql(
        'INSERT INTO users_new (id, name, active) SELECT id, name, active FROM users;',
        [],
        () => {
          console.log('Data copied to the new users table successfully');
        },
        (_, error) => {
          console.error('Error copying data to the new users table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      tx.executeSql(
        'INSERT INTO habits_new (id, userId, habit, consecutiveDaysCompleted, maxConsecutiveDaysCompleted, habitReached, goal, ask, notificationTime, notificationId) SELECT id, userId, habit, consecutiveDaysCompleted, maxConsecutiveDaysCompleted, habitReached, goal, ask, notificationTime, notificationId FROM habits;',
        [],
        () => {
          console.log('Data copied to the new habits table successfully');
        },
        (_, error) => {
          console.error('Error copying data to the new habits table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      tx.executeSql(
        'INSERT INTO habits_dates_new (id, userId, habitId, dateCompleted) SELECT id, userId, habitId, dateCompleted FROM habits_dates;',
        [],
        () => {
          console.log('Data copied to the new habits_dates table successfully');
        },
        (_, error) => {
          console.error(
            'Error copying data to the new habits_dates table:',
            error,
          );
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      // Step 3: Remove old tables
      tx.executeSql(
        'DROP TABLE IF EXISTS users;',
        [],
        () => {
          console.log('Old users table deleted successfully');
        },
        (_, error) => {
          console.error('Error deleting old users table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      tx.executeSql(
        'DROP TABLE IF EXISTS habits;',
        [],
        () => {
          console.log('Old habits table deleted successfully');
        },
        (_, error) => {
          console.error('Error deleting old habits table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      tx.executeSql(
        'DROP TABLE IF EXISTS habits_dates;',
        [],
        () => {
          console.log('Old habits_dates table deleted successfully');
        },
        (_, error) => {
          console.error('Error deleting old habits_dates table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      // Step 4: Rename the new tables to remove the suffix
      tx.executeSql(
        'ALTER TABLE users_new RENAME TO users;',
        [],
        () => {
          console.log('New users table renamed successfully');
        },
        (_, error) => {
          console.error('Error renaming new users table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      tx.executeSql(
        'ALTER TABLE habits_new RENAME TO habits;',
        [],
        () => {
          console.log('New habits table renamed successfully');
        },
        (_, error) => {
          console.error('Error renaming new habits table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      tx.executeSql(
        'ALTER TABLE habits_dates_new RENAME TO habits_dates;',
        [],
        () => {
          console.log('New habits_dates table renamed successfully');
        },
        (_, error) => {
          console.error('Error renaming new habits_dates table:', error);
          reject(error);
          return false; // Prevent the transaction from continuing
        },
      );

      // Step 5: Update the version in the version table
      tx.executeSql('delete from version;', [], () => {
        // The DELETE operation is complete, now perform the INSERT
        tx.executeSql(
          `insert into version (version) values (${DB_VERSION});`,
          [],
          () => {
            console.log('Version updated successfully');
            resolve(true);
          },
          (_, error) => {
            console.error('Error updating version:', error);
            reject(error);
            return false; // Prevent the transaction from continuing
          },
        );
      });

      resolve(true); // Migration completed successfully
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

const insertUserHabit = (habit: IHabitInput): Promise<IHabitInput> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO habits (userId, habit, consecutiveDaysCompleted, maxConsecutiveDaysCompleted, habitReached, goal, ask, notificationTime, notificationId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        ],
        (_, resultSet) => {
          console.log('User habit inserted successfully:', resultSet);
          resolve(habit);
        },
        (_, error): boolean => {
          console.error('Error inserting user habit:', error);
          reject(error);
          return false;
        },
      );
    });
  });
};

const updateUserHabit = async (habit: IHabit) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Updating user habit');
        tx.executeSql(
          'update habits set userId = ?, habit = ?, consecutiveDaysCompleted = ?, maxConsecutiveDaysCompleted = ?, habitReached = ?, goal = ?, ask = ?, notificationTime = ?, notificationId = ? where id = ?;',
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
            habit.id,
          ],
        );
        resolve(true);
      } catch (error) {
        console.error(error, 'error updating user habit');
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

const completeUserHabit = async (habit: IHabit) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        console.log('Updating user habit');
        tx.executeSql(
          'update habits set consecutiveDaysCompleted = ?, maxConsecutiveDaysCompleted = ?, habitReached = ? where id = ?;',
          [
            habit.consecutiveDaysCompleted,
            habit.maxConsecutiveDaysCompleted,
            habit.habitReached,
            habit.id,
          ],
        );
        console.log('Inserting user habit date');
        tx.executeSql(
          'insert into habits_dates (userId, habitId, dateCompleted) values (?, ?, ?)',
          [habit.userId, habit.id, dayjs().local().format(dateFormat)],
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
        console.error(error, 'error getting user habits dates');
        reject(error);
      }
    });
  });
};

export const database = {
  setupDatabase,
  isDatabaseUpToDate,
  migrateDatabase,
  dropDatabaseTablesAsync,
  getActiveUser,
  insertUser,
  deleteUser,
  getUserHabits,
  insertUserHabit,
  updateUserHabit,
  deleteUserHabit,
  completeUserHabit,
  getUserHabitsDates,
};
