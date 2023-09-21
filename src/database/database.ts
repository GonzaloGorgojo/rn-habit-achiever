import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase } from 'expo-sqlite';
import { SQliteEmptyTransaction } from '@src/common/types/types';

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

export const createTable = (db: SQLiteDatabase | SQliteEmptyTransaction) => {
  db.transaction((tx) => {
    tx.executeSql(
      //create a table for users
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, active boolean);',
    );
  });
};
