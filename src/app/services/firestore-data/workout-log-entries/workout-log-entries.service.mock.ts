import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createWorkoutLogEntriesServiceMock() {
  const mock = createFirestoreDataServiceMock('DailyExercisesService');
  mock.getAllForLog = jasmine.createSpy('getAllForLog');
  mock.getAllForLog.and.returnValue(Promise.resolve([]));
  return mock;
}
