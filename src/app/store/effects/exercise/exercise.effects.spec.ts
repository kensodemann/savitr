import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { ExerciseEffects } from './exercise.effects';
import { ExerciseTypes, ExerciseFocusAreas } from '@app/default-data';
import { createExercisesServiceMock } from '@app/services/firestore-data/mocks';
import { ExercisesService } from '@app/services/firestore-data';
import * as exerciseActions from '@app/store/actions/exercise.actions';
import { Exercise } from '@app/models';

let actions$: Observable<any>;
let effects: ExerciseEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      ExerciseEffects,
      { provide: ExercisesService, useFactory: createExercisesServiceMock },
      provideMockActions(() => actions$)
    ]
  });

  effects = TestBed.inject(ExerciseEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('load$', () => {
  it('observes changes to the exercises', () => {
    const exercisesService = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.load());
    effects.changes$.subscribe(() => {});
    expect(exercisesService.observeChanges).toHaveBeenCalledTimes(1);
  });

  describe('added change', () => {
    it('dispaches an added exercise action', done => {
      const exercisesService = TestBed.inject(ExercisesService);
      (exercisesService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'New Exercise',
                  description: 'I am a newly added exercise',
                  type: ExerciseTypes.Machine,
                  area: ExerciseFocusAreas.FullBody
                })
              }
            }
          }
        ])
      );
      actions$ = of(exerciseActions.load());
      effects.changes$.subscribe((action: any) => {
        const expected = exerciseActions.exerciseAdded({
          exercise: {
            id: '123499dfi',
            name: 'New Exercise',
            description: 'I am a newly added exercise',
            type: ExerciseTypes.Machine,
            area: ExerciseFocusAreas.FullBody
          }
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('modified change', () => {
    it('dispaches a modified exercise action', done => {
      const exercisesService = TestBed.inject(ExercisesService);
      (exercisesService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'modified',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'Changed',
                  description: 'I am a modified exercise',
                  type: ExerciseTypes.Class,
                  area: ExerciseFocusAreas.LowerBody
                })
              }
            }
          }
        ])
      );
      actions$ = of(exerciseActions.load());
      effects.changes$.subscribe((action: any) => {
        const expected = exerciseActions.exerciseModified({
          exercise: {
            id: '123499dfi',
            name: 'Changed',
            description: 'I am a modified exercise',
            type: ExerciseTypes.Class,
            area: ExerciseFocusAreas.LowerBody
          }
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('removed change', () => {
    it('dispaches a removed exercise action', done => {
      const exercisesService = TestBed.inject(ExercisesService);
      (exercisesService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'Sitting',
                  description: 'I am not really an exercise',
                  type: ExerciseTypes.BodyWeight,
                  area: ExerciseFocusAreas.FullBody
                })
              }
            }
          }
        ])
      );
      actions$ = of(exerciseActions.load());
      effects.changes$.subscribe((action: any) => {
        const expected = exerciseActions.exerciseRemoved({
          exercise: {
            id: '123499dfi',
            name: 'Sitting',
            description: 'I am not really an exercise',
            type: ExerciseTypes.BodyWeight,
            area: ExerciseFocusAreas.FullBody
          }
        });
        expect(action).toEqual(expected);
        done();
      });
    });
  });

  describe('multiple changes', () => {
    it('dispaches the adds as a unit', fakeAsync(() => {
      const exercisesService = TestBed.inject(ExercisesService);
      (exercisesService.observeChanges as any).mockReturnValue(
        of([
          {
            type: 'added',
            payload: {
              doc: {
                id: 'f99g0e9fg',
                data: () => ({
                  name: 'Situp',
                  description: 'I am an exercise',
                  type: ExerciseTypes.BodyWeight,
                  area: ExerciseFocusAreas.Core
                })
              }
            }
          },
          {
            type: 'removed',
            payload: {
              doc: {
                id: '123499dfi',
                data: () => ({
                  name: 'Sitdown',
                  description: 'I am not really an exercise',
                  type: ExerciseTypes.BodyWeight,
                  area: ExerciseFocusAreas.Core
                })
              }
            }
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fkkfig0939r',
                data: () => ({
                  name: 'Burpee',
                  description: 'GI Jane Time!',
                  type: ExerciseTypes.BodyWeight,
                  area: ExerciseFocusAreas.Core
                })
              }
            }
          },
          {
            type: 'added',
            payload: {
              doc: {
                id: 'fiig0939034',
                data: () => ({
                  name: 'Curl',
                  description: 'Basic bicep exercise',
                  type: ExerciseTypes.FreeWeight,
                  area: ExerciseFocusAreas.UpperBody
                })
              }
            }
          },
          {
            type: 'modified',
            payload: {
              doc: {
                id: 'fi38849958392j',
                data: () => ({
                  name: 'Bench Press',
                  description: 'How much can you press, bro?',
                  type: ExerciseTypes.FreeWeight,
                  area: ExerciseFocusAreas.UpperBody
                })
              }
            }
          }
        ])
      );
      actions$ = of(exerciseActions.load());
      let calls = 0;
      effects.changes$.subscribe((action: any) => {
        let expected: Action;
        switch (calls) {
          case 0:
            expected = exerciseActions.exerciseRemoved({
              exercise: {
                id: '123499dfi',
                name: 'Sitdown',
                description: 'I am not really an exercise',
                type: ExerciseTypes.BodyWeight,
                area: ExerciseFocusAreas.Core
              }
            });
            break;

          case 1:
            expected = exerciseActions.exerciseModified({
              exercise: {
                id: 'fi38849958392j',
                name: 'Bench Press',
                description: 'How much can you press, bro?',
                type: ExerciseTypes.FreeWeight,
                area: ExerciseFocusAreas.UpperBody
              }
            });
            break;

          case 2:
            expected = exerciseActions.exercisesAdded({
              exercises: [
                {
                  id: 'f99g0e9fg',
                  name: 'Situp',
                  description: 'I am an exercise',
                  type: ExerciseTypes.BodyWeight,
                  area: ExerciseFocusAreas.Core
                },
                {
                  id: 'fkkfig0939r',
                  name: 'Burpee',
                  description: 'GI Jane Time!',
                  type: ExerciseTypes.BodyWeight,
                  area: ExerciseFocusAreas.Core
                },
                {
                  id: 'fiig0939034',
                  name: 'Curl',
                  description: 'Basic bicep exercise',
                  type: ExerciseTypes.FreeWeight,
                  area: ExerciseFocusAreas.UpperBody
                }
              ]
            });
            break;

          default:
            break;
        }
        expect(action).toEqual(expected);
        calls++;
        tick();
      });
      expect(calls).toEqual(3);
    }));
  });

  it('does nothing for other actions', () => {
    const exercisesService = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.update({ exercise: null }));
    effects.changes$.subscribe(() => {});
    expect(exercisesService.observeChanges).not.toHaveBeenCalled();
  });
});

describe('create$', () => {
  let exercise: Exercise;
  beforeEach(() => {
    exercise = {
      id: 'fkkfig0939r',
      name: 'Biking',
      description: 'I am an exercise',
      type: ExerciseTypes.Machine,
      area: ExerciseFocusAreas.Cardio
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.create({ exercise }));
    effects.create$.subscribe(() => {});
    expect(service.add).toHaveBeenCalledTimes(1);
    expect(service.add).toHaveBeenCalledWith(exercise);
  });

  it('dispatches create success', done => {
    actions$ = of(exerciseActions.create({ exercise }));
    effects.create$.subscribe((action: any) => {
      expect(action).toEqual({ type: exerciseActions.ExerciseActionTypes.createSuccess });
      done();
    });
  });

  it('dispatches create errors', done => {
    const service = TestBed.inject(ExercisesService);
    (service.add as any).mockRejectedValue(new Error('The create failed'));
    actions$ = of(exerciseActions.create({ exercise }));
    effects.create$.subscribe((action: any) => {
      expect(action).toEqual({
        type: exerciseActions.ExerciseActionTypes.createFailure,
        error: new Error('The create failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.update({ exercise }));
    effects.create$.subscribe(() => {});
    expect(service.add).not.toHaveBeenCalled();
  });
});

describe('update$', () => {
  let exercise: Exercise;
  beforeEach(() => {
    exercise = {
      id: 'fkkfig0939r',
      name: 'Jogging',
      description: 'I am an exercise',
      type: ExerciseTypes.BodyWeight,
      area: ExerciseFocusAreas.Cardio
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.update({ exercise }));
    effects.update$.subscribe(() => {});
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(exercise);
  });

  it('dispatches update success', done => {
    actions$ = of(exerciseActions.update({ exercise }));
    effects.update$.subscribe((action: any) => {
      expect(action).toEqual({ type: exerciseActions.ExerciseActionTypes.updateSuccess });
      done();
    });
  });

  it('dispatches update errors', done => {
    const service = TestBed.inject(ExercisesService);
    (service.update as any).mockRejectedValue(new Error('The update failed'));
    actions$ = of(exerciseActions.update({ exercise }));
    effects.update$.subscribe((action: any) => {
      expect(action).toEqual({
        type: exerciseActions.ExerciseActionTypes.updateFailure,
        error: new Error('The update failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.create({ exercise }));
    effects.update$.subscribe(() => {});
    expect(service.update).not.toHaveBeenCalled();
  });
});

describe('remove$', () => {
  let exercise: Exercise;
  beforeEach(() => {
    exercise = {
      id: 'fkkfig0939r',
      name: 'Sleep',
      description: 'I am not really an exercise',
      type: ExerciseTypes.BodyWeight,
      area: ExerciseFocusAreas.FullBody
    };
  });

  it('calls the service', () => {
    const service = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.remove({ exercise }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).toHaveBeenCalledTimes(1);
    expect(service.delete).toHaveBeenCalledWith(exercise);
  });

  it('dispatches remove success', done => {
    actions$ = of(exerciseActions.remove({ exercise }));
    effects.remove$.subscribe((action: any) => {
      expect(action).toEqual({ type: exerciseActions.ExerciseActionTypes.removeSuccess });
      done();
    });
  });

  it('dispatches remove failure', done => {
    const service = TestBed.inject(ExercisesService);
    (service.delete as any).mockRejectedValue(new Error('The remove failed'));
    actions$ = of(exerciseActions.remove({ exercise }));
    effects.remove$.subscribe((action: any) => {
      expect(action).toEqual({
        type: exerciseActions.ExerciseActionTypes.removeFailure,
        error: new Error('The remove failed')
      });
      done();
    });
  });

  it('does nothing for other actions', () => {
    const service = TestBed.inject(ExercisesService);
    actions$ = of(exerciseActions.update({ exercise }));
    effects.remove$.subscribe(() => {});
    expect(service.delete).not.toHaveBeenCalled();
  });
});
