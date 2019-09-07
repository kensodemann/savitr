import { Exercise } from './exercise';
import { WorkoutLog } from './workout-log';

export interface WorkoutLogEntry {
  id?: string;
  exercise: Exercise;
  workoutLog: WorkoutLog;
  logDate: Date;
  sets?: number;
  reps?: number;
  time?: string;
  weight?: number;
  completed: boolean;
}
