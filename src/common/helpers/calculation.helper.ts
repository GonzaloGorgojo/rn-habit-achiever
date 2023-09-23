export const calculatePercentage = (value: number, total: number): number => {
  return Math.round((value * 100) / total);
};
