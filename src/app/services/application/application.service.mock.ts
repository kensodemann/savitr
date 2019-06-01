export function createApplicationServiceMock() {
  return jasmine.createSpyObj('ApplicationService', ['registerForUpdates']);
}
