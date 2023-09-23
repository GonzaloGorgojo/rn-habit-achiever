export interface IUser {
  id: number;
  name: string;
}

export interface IHabit {
  id: number;
  userId: number;
  habit: string;
  consecutiveDaysCompleted: number;
  maxConsecutiveDaysCompleted: number;
  habitReached: boolean;
  goal: number;
  ask: boolean;
}

export interface ICreateHabit {
  habit: string;
  goal: number;
}
