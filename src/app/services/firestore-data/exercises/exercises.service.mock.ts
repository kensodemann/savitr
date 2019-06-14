import { EMPTY } from 'rxjs';

export function createExercisesServiceMock() {
  return jasmine.createSpyObj('exercisesService', {
    all: EMPTY,
    get: EMPTY,
    add: Promise.resolve(),
    delete: Promise.resolve(),
    update: Promise.resolve(),
  });
}
