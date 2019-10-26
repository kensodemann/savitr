import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export function createWorkoutLogEntriesServiceMock() {
  const mock = createFirestoreDataServiceMock();
  (mock as any).getAllForLog = jest.fn(() => Promise.resolve([]));
  return mock;
}
