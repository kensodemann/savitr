import { Dictionary } from '@ngrx/entity';

import { ExerciseFocusAreas, ExerciseTypes } from '@app/default-data';
import { initialState, reducer } from './exercise.reducer';
import {
  ExerciseActionTypes,
  createFailure,
  updateFailure,
  removeFailure,
  loadFailure,
  exerciseAdded,
  exercisesAdded,
  exerciseModified,
  exerciseRemoved
} from '@app/store/actions/exercise.actions';
import { Exercise } from '@app/models';

let testExercises: Dictionary<Exercise>;
let testExerciseIds: Array<string>;

beforeEach(() => {
  initializeTestData();
});

it('returns the default state', () => {
  expect(reducer(undefined, { type: 'NOOP' })).toEqual(initialState);
});

describe(ExerciseActionTypes.load, () => {
  it('sets loading true, removes any entities, and undefines any error', () => {
    expect(
      reducer(
        {
          ...initialState,
          ids: [...testExerciseIds],
          entities: { ...testExercises },
          error: new Error('the last load failed')
        },
        { type: ExerciseActionTypes.load }
      )
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });
});

describe(ExerciseActionTypes.loadFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = loadFailure({ error: new Error('Could not load the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not load the data')
    });
  });
});

describe(ExerciseActionTypes.create, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer({ ...initialState, error: new Error('the last create failed') }, { type: ExerciseActionTypes.create })
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });
});

describe(ExerciseActionTypes.createFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = createFailure({ error: new Error('Could not create the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not create the data')
    });
  });
});

describe(ExerciseActionTypes.update, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer({ ...initialState, error: new Error('the last update failed') }, { type: ExerciseActionTypes.update })
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });
});

describe(ExerciseActionTypes.updateFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = updateFailure({ error: new Error('Could not update the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not update the data')
    });
  });
});

describe(ExerciseActionTypes.remove, () => {
  it('sets loading true and undefines any error', () => {
    expect(
      reducer({ ...initialState, error: new Error('the last remove failed') }, { type: ExerciseActionTypes.remove })
    ).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });
});

describe(ExerciseActionTypes.removeFailure, () => {
  it('sets the error and clears the loading flag', () => {
    const action = removeFailure({ error: new Error('Could not remove the data') });
    expect(reducer({ ...initialState, loading: true }, action)).toEqual({
      ...initialState,
      loading: false,
      error: new Error('Could not remove the data')
    });
  });
});

describe(ExerciseActionTypes.exerciseAdded, () => {
  it('adds the exercise to an empty state', () => {
    const exercise: Exercise = {
      id: '194309fkadsfoi',
      name: 'Bench Press',
      description: 'Lay with back on bench and press barbell up off of chest',
      type: ExerciseTypes.FreeWeight,
      area: ExerciseFocusAreas.UpperBody
    };
    const action = exerciseAdded({ exercise });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      ids: ['194309fkadsfoi'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Bench Press',
          description: 'Lay with back on bench and press barbell up off of chest',
          type: ExerciseTypes.FreeWeight,
          area: ExerciseFocusAreas.UpperBody
        }
      }
    });
  });

  it('adds the exercise to the existing ones', () => {
    const exercise: Exercise = {
      id: '194309fkadsfoi',
      name: 'Bench Press',
      description: 'Lay with back on bench and press barbell up off of chest',
      type: ExerciseTypes.FreeWeight,
      area: ExerciseFocusAreas.UpperBody
    };
    const action = exerciseAdded({ exercise });
    expect(reducer({ ...initialState, loading: true, ids: testExerciseIds, entities: testExercises }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: [...testExerciseIds, '194309fkadsfoi'],
      entities: {
        ...testExercises,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Bench Press',
          description: 'Lay with back on bench and press barbell up off of chest',
          type: ExerciseTypes.FreeWeight,
          area: ExerciseFocusAreas.UpperBody
        }
      }
    });
  });
});

describe(ExerciseActionTypes.exercisesAdded, () => {
  it('adds the exercises to an empty state', () => {
    const exercises: Array<Exercise> = [
      {
        id: '194309fkadsfoi',
        name: 'Bench Press',
        description: 'Lay with back on bench and press barbell up off of chest',
        type: ExerciseTypes.FreeWeight,
        area: ExerciseFocusAreas.UpperBody
      },
      {
        id: 'fiiagoie92',
        name: 'Impact',
        description: 'Boxing and Kick-Boxing routines',
        type: ExerciseTypes.Class,
        area: ExerciseFocusAreas.FullBody
      },
      {
        id: 'figof003f3',
        name: 'Zumba',
        description: 'Dancing and prancing',
        type: ExerciseTypes.Class,
        area: ExerciseFocusAreas.FullBody
      }
    ];
    const action = exercisesAdded({ exercises });
    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      loading: false,
      ids: ['194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Bench Press',
          description: 'Lay with back on bench and press barbell up off of chest',
          type: ExerciseTypes.FreeWeight,
          area: ExerciseFocusAreas.UpperBody
        },
        fiiagoie92: {
          id: 'fiiagoie92',
          name: 'Impact',
          description: 'Boxing and Kick-Boxing routines',
          type: ExerciseTypes.Class,
          area: ExerciseFocusAreas.FullBody
        },
        figof003f3: {
          id: 'figof003f3',
          name: 'Zumba',
          description: 'Dancing and prancing',
          type: ExerciseTypes.Class,
          area: ExerciseFocusAreas.FullBody
        }
      }
    });
  });

  it('adds the exercises to the existing ones', () => {
    const exercises: Array<Exercise> = [
      {
        id: '194309fkadsfoi',
        name: 'Bench Press',
        description: 'Lay with back on bench and press barbell up off of chest',
        type: ExerciseTypes.FreeWeight,
        area: ExerciseFocusAreas.UpperBody
      },
      {
        id: 'fiiagoie92',
        name: 'Impact',
        description: 'Boxing and Kick-Boxing routines',
        type: ExerciseTypes.Class,
        area: ExerciseFocusAreas.FullBody
      },
      {
        id: 'figof003f3',
        name: 'Zumba',
        description: 'Dancing and prancing',
        type: ExerciseTypes.Class,
        area: ExerciseFocusAreas.FullBody
      }
    ];
    const action = exercisesAdded({ exercises });
    expect(reducer({ ...initialState, loading: true, ids: testExerciseIds, entities: testExercises }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: [...testExerciseIds, '194309fkadsfoi', 'fiiagoie92', 'figof003f3'],
      entities: {
        ...testExercises,
        '194309fkadsfoi': {
          id: '194309fkadsfoi',
          name: 'Bench Press',
          description: 'Lay with back on bench and press barbell up off of chest',
          type: ExerciseTypes.FreeWeight,
          area: ExerciseFocusAreas.UpperBody
        },
        fiiagoie92: {
          id: 'fiiagoie92',
          name: 'Impact',
          description: 'Boxing and Kick-Boxing routines',
          type: ExerciseTypes.Class,
          area: ExerciseFocusAreas.FullBody
        },
        figof003f3: {
          id: 'figof003f3',
          name: 'Zumba',
          description: 'Dancing and prancing',
          type: ExerciseTypes.Class,
          area: ExerciseFocusAreas.FullBody
        }
      }
    });
  });
});

describe(ExerciseActionTypes.exerciseModified, () => {
  it('modifies the specified exercise', () => {
    const exercise: Exercise = {
      id: 'ff898gd',
      name: 'Pushups',
      description: 'You know how to do this already...',
      type: ExerciseTypes.BodyWeight,
      area: ExerciseFocusAreas.Core
    };
    const expected = { ...testExercises };
    expected.ff898gd = exercise;
    const action = exerciseModified({ exercise });
    expect(reducer({ ...initialState, loading: true, ids: testExerciseIds, entities: testExercises }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: testExerciseIds,
      entities: expected
    });
  });
});

describe(ExerciseActionTypes.exerciseRemoved, () => {
  it('deletes the exercise', () => {
    const exercise: Exercise = {
      id: 'ff88t99er',
      name: 'Curl',
      description: 'Pivot arms at elbows with weight using biscepts',
      type: ExerciseTypes.FreeWeight,
      area: ExerciseFocusAreas.UpperBody
    };
    const expected = { ...testExercises };
    delete expected.ff88t99er;
    const action = exerciseRemoved({ exercise });
    expect(reducer({ ...initialState, loading: true, ids: testExerciseIds, entities: testExercises }, action)).toEqual({
      ...initialState,
      loading: false,
      ids: [testExerciseIds[0], testExerciseIds[1], testExerciseIds[3]],
      entities: expected
    });
  });
});

function initializeTestData() {
  testExerciseIds = ['asdf1234', 'ff898gd', 'ff88t99er', '1849gasdf'];
  testExercises = {
    asdf1234: {
      id: 'asdf1234',
      name: 'Situp',
      description: 'Full sit-up with arms behind head',
      type: ExerciseTypes.BodyWeight,
      area: ExerciseFocusAreas.Core
    },
    ff898gd: {
      id: 'ff898gd',
      name: 'Pushup',
      description: 'Face the floor, lower the body to the floor, push back up',
      type: ExerciseTypes.BodyWeight,
      area: ExerciseFocusAreas.Core
    },
    ff88t99er: {
      id: 'ff88t99er',
      name: 'Curl',
      description: 'Pivot arms at elbows with weight using biscepts',
      type: ExerciseTypes.FreeWeight,
      area: ExerciseFocusAreas.UpperBody
    },
    '1849gasdf': {
      id: '1849gasdf',
      name: 'Squat',
      description: 'Squat down with knees over toes and butt pushed back, stand back up',
      type: ExerciseTypes.FreeWeight,
      area: ExerciseFocusAreas.LowerBody
    }
  };
}
