import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import * as ExerciseActions from '@app/store/actions/exercise.actions';
import { Exercise } from '@app/models';

export interface ExercisesState extends EntityState<Exercise> {
  loading: boolean;
  error?: Error;
}

const adapter = createEntityAdapter<Exercise>();

export const initialState = adapter.getInitialState({ loading: false });

const exerciseReducer = createReducer(
  initialState,
  on(ExerciseActions.load, state => adapter.removeAll({ ...state, loading: true, error: undefined })),
  on(ExerciseActions.loadFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ExerciseActions.create, state => ({ ...state, loading: true, error: undefined })),
  on(ExerciseActions.createFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ExerciseActions.update, state => ({ ...state, loading: true, error: undefined })),
  on(ExerciseActions.updateFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ExerciseActions.remove, state => ({ ...state, loading: true, error: undefined })),
  on(ExerciseActions.removeFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(ExerciseActions.exerciseAdded, (state, { exercise }) => adapter.addOne(exercise, { ...state, loading: false })),
  on(ExerciseActions.exercisesAdded, (state, { exercises }) =>
    adapter.addMany(exercises, { ...state, loading: false })
  ),
  on(ExerciseActions.exerciseModified, (state, { exercise }) =>
    adapter.updateOne({ id: exercise.id, changes: exercise }, { ...state, loading: false })
  ),
  on(ExerciseActions.exerciseRemoved, (state, { exercise }) =>
    adapter.removeOne(exercise.id, { ...state, loading: false })
  )
);

export function reducer(state: ExercisesState | undefined, action: Action) {
  return exerciseReducer(state, action);
}

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
export const selectors = {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
};
