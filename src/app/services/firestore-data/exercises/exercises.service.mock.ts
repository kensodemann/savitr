import { createFirestoreDataServiceMock  } from '../firestore-data.service.mock';

export function createExercisesServiceMock() {
  return createFirestoreDataServiceMock('ExercisesService');
}
