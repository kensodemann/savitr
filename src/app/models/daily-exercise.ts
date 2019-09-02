import { Exercise } from './exercise';

export interface DailyExercise extends Exercise {
  workLogId: string;
  day: number;
}
