export function createWorkoutPageServiceMock() {
  return {
    add: jest.fn(() => Promise.resolve(false)),
    edit: jest.fn(() => Promise.resolve(false)),
    delete: jest.fn(() => Promise.resolve(false)),
    logEntries: jest.fn(() => Promise.resolve([[], [], [], [], [], [], []])),
  };
}
