import { createAction, props } from '@ngrx/store';
import { Exercise } from '@app/models';

export enum ExerciseActionTypes {
  create = '[Exercise Editor] add exercise',
  createSuccess = '[Exercises API] create success',
  createFailure = '[Exercises API] create failure',

  update = '[Exercise Editor] update exercise',
  updateSuccess = '[Exercises API] update success',
  updateFailure = '[Exercises API] update failure',

  remove = '[Exercises List Page] remove exercise',
  removeSuccess = '[Exercises API] remove success',
  removeFailure = '[Exercises API] remove failure',

  load = '[Application] load exercise',
  loadSuccess = '[Exercises API] load success',
  loadFailure = '[Exercises API] load failure',

  exerciseAdded = '[Exercise Load State Change] added',
  exercisesAdded = '[Exercise Load State Change] added many',
  exerciseModified = '[Exercise Load State Change] modified',
  exerciseRemoved = '[Exercise Load State Change] removed'
}

export const create = createAction(ExerciseActionTypes.create, props<{ exercise: Exercise }>());
export const createSuccess = createAction(ExerciseActionTypes.createSuccess);
export const createFailure = createAction(ExerciseActionTypes.createFailure, props<{ error: Error }>());

export const update = createAction(ExerciseActionTypes.update, props<{ exercise: Exercise }>());
export const updateSuccess = createAction(ExerciseActionTypes.updateSuccess);
export const updateFailure = createAction(ExerciseActionTypes.updateFailure, props<{ error: Error }>());

export const remove = createAction(ExerciseActionTypes.remove, props<{ exercise: Exercise }>());
export const removeSuccess = createAction(ExerciseActionTypes.removeSuccess);
export const removeFailure = createAction(ExerciseActionTypes.removeFailure, props<{ error: Error }>());

export const load = createAction(ExerciseActionTypes.load);
export const loadSuccess = createAction(ExerciseActionTypes.loadSuccess);
export const loadFailure = createAction(ExerciseActionTypes.loadFailure, props<{ error: Error }>());

export const exerciseAdded = createAction(ExerciseActionTypes.exerciseAdded, props<{ exercise: Exercise }>());
export const exercisesAdded = createAction(ExerciseActionTypes.exercisesAdded, props<{ exercises: Array<Exercise> }>());
export const exerciseModified = createAction(ExerciseActionTypes.exerciseModified, props<{ exercise: Exercise }>());
export const exerciseRemoved = createAction(ExerciseActionTypes.exerciseRemoved, props<{ exercise: Exercise }>());
