import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ExercisesService } from '@app/services/firestore-data';
import * as exerciseActions from '@app/store/actions/exercise.actions';
import { Exercise } from '@app/models';

interface ExerciseChangeAction {
  type: string;
  exercise?: Exercise;
  exercises?: Array<Exercise>;
}

@Injectable()
export class ExerciseEffects {
  constructor(private actions$: Actions, private exercisesService: ExercisesService) {}

  changes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(exerciseActions.load),
      mergeMap(() =>
        this.exercisesService.observeChanges().pipe(
          mergeMap(actions => this.unpackActions(actions)),
          map(action => this.exerciseAction(action))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(exerciseActions.create),
      mergeMap(action =>
        from(this.exercisesService.add(action.exercise)).pipe(
          map(() => exerciseActions.createSuccess()),
          catchError(error => of(exerciseActions.createFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(exerciseActions.update),
      mergeMap(action =>
        from(this.exercisesService.update(action.exercise)).pipe(
          map(() => exerciseActions.updateSuccess()),
          catchError(error => of(exerciseActions.updateFailure({ error })))
        )
      )
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(exerciseActions.remove),
      mergeMap(action =>
        from(this.exercisesService.delete(action.exercise)).pipe(
          map(() => exerciseActions.removeSuccess()),
          catchError(error => of(exerciseActions.removeFailure({ error })))
        )
      )
    )
  );

  private unpackActions(actions: Array<DocumentChangeAction<Exercise>>): Array<ExerciseChangeAction> {
    let mainActions: Array<DocumentChangeAction<Exercise>>;
    let groupedActions: Array<DocumentChangeAction<Exercise>>;
    if (actions.length > 1) {
      groupedActions = actions.filter(a => a.type === 'added');
      mainActions = actions.filter(a => a.type !== 'added');
    } else {
      groupedActions = [];
      mainActions = actions;
    }

    const changeActions: Array<ExerciseChangeAction> = mainActions.map(action => ({
      type: action.type,
      exercise: this.docActionToExercise(action)
    }));

    if (groupedActions.length) {
      changeActions.push({
        type: 'added many',
        exercises: groupedActions.map(action => this.docActionToExercise(action))
      });
    }

    return changeActions;
  }

  private docActionToExercise(action: DocumentChangeAction<Exercise>): Exercise {
    return {
      id: action.payload.doc.id,
      ...(action.payload.doc.data() as Exercise)
    };
  }

  private exerciseAction(action: ExerciseChangeAction): Action {
    switch (action.type) {
      case 'added many':
        return exerciseActions.exercisesAdded({ exercises: action.exercises });

      case 'added':
        return exerciseActions.exerciseAdded({ exercise: action.exercise });

      case 'modified':
        return exerciseActions.exerciseModified({ exercise: action.exercise });

      case 'removed':
        return exerciseActions.exerciseRemoved({ exercise: action.exercise });

      /* istanbul ignore next */
      default:
        console.error(`Unknown action type ${action.type}`);
        break;
    }
  }
}
