export function createWorkoutPageServiceMock() {
  return jasmine.createSpyObj('WorkoutPageService', {
    add: Promise.resolve(false),
    edit: Promise.resolve(false),
    delete: Promise.resolve(false),
    logEntries: Promise.resolve([[], [], [], [], [], [], []])
  });
}
