import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';

import { AuthState, reducer as authReducer } from './auth/auth.reducer';
import { ExercisesState, reducer as exercisesReducer } from './exercise/exercise.reducer';

export interface State {
  auth: AuthState;
  exercises: ExercisesState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  exercises: exercisesReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
