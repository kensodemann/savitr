export function createDateServiceMock() {
  return {
    currentBeginDate: jest.fn(() => new Date()),
    beginDates: jest.fn(() => []),
    format: jest.fn(() => '')
  };
}
