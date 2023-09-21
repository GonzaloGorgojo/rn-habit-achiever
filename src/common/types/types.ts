export type SQliteEmptyTransaction = {
  transaction: () => {
    executeSql: () => void;
  };
};
