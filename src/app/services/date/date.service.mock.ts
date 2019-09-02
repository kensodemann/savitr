export function createDateServiceMock() {
  return jasmine.createSpyObj('DateService', {
    currentBeginDate: new Date(),
    beginDates: [],
    format: ''
  });
}
