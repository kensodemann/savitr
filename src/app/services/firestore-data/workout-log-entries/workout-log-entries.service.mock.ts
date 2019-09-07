import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createWorkoutLogEntriesServiceMock() {
  return createFirestoreDataServiceMock('DailyExercisesService');
}
