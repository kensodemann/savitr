import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createDailyExercisesServiceMock() {
  return createFirestoreDataServiceMock('DailyExercisesService');
}
