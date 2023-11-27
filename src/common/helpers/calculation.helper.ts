export const calculatePercentage = (value: number, total: number): number => {
  return Math.round((value * 100) / total);
};

interface ITimeObject {
  hours: number;
  minutes: number;
  seconds: number;
}

export const formatTime = (timeobject: ITimeObject): string => {
  const { hours, minutes } = timeobject;
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(
    minutes,
  ).padStart(2, '0')}`;
  return formattedTime;
};
