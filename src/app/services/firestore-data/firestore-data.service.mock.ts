import { EMPTY } from 'rxjs';

export function createFirestoreDataServiceMock(name: string) {
  return jasmine.createSpyObj(name, {
    all: EMPTY,
    get: EMPTY,
    add: Promise.resolve(),
    delete: Promise.resolve(),
    update: Promise.resolve()
  });
}
