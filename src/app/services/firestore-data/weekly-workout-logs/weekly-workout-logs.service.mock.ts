import { createFirestoreDataServiceMock } from '../firestore-data.service.mock';

export const createWeeklyWorkoutLogsServiceMock = () => {
  const mock = createFirestoreDataServiceMock();
  (mock as any).getForDate = jest.fn();
  return mock;
};
