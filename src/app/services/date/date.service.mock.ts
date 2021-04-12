export const createDateServiceMock = () => ({
  currentBeginDate: jest.fn(() => new Date()),
  currentDay: jest.fn(() => 0),
  beginDates: jest.fn(() => []),
  format: jest.fn(() => ''),
});
