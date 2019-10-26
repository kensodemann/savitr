import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createWeeklyWorkoutLogsServiceMock() {
  const mock = createFirestoreDataServiceMock();
  (mock as any).getForDate = jest.fn();
  return mock;
}
