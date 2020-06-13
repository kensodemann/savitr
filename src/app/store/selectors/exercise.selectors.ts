import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectors, ExercisesState } from '@app/store/reducers/exercise/exercise.reducer';

export const selectExercises = createFeatureSelector('exercises');
export const selectExerciseEntities = createSelector(selectExercises, selectors.selectEntities);
export const selectAllExercises = createSelector(selectExercises, selectors.selectAll);
export const selectExerciseIds = createSelector(selectExercises, selectors.selectIds);
export const selectExerciseLoading = createSelector(selectExercises, (state: ExercisesState) => state.loading);
export const selectExerciseError = createSelector(selectExercises, (state: ExercisesState) => state.error);
