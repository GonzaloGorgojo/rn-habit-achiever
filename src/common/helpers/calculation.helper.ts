export const calculatePercentage = (
  value: number,
  total: number = 21,
): number => {
  return Math.round((value * 100) / total);
};
