import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createWeeklyWorkoutLogsServiceMock() {
  const mock = createFirestoreDataServiceMock('WeeklyWorkoutLogsService');
  mock.getForDate = jasmine.createSpy();
  return mock;
}
