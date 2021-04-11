import { inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  createAngularFireAuthMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFirestoreMock,
  createCollectionReferenceMock,
  createDocumentSnapshotMock,
} from '@test/mocks';
import { firestore } from 'firebase/app';
import { WorkoutLogEntriesService } from './workout-log-entries.service';

describe('DailyExercisesService', () => {
  let collection;
  let doc;
  let workoutLogEntries: WorkoutLogEntriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock },
      ],
    });
    const angularFirestore = TestBed.inject(AngularFirestore);
    doc = createAngularFirestoreDocumentMock();
    collection = createAngularFirestoreCollectionMock();
    collection.doc.mockReturnValue(doc);
    doc.collection.mockReturnValue(collection);
    (angularFirestore.collection as any).mockReturnValue(collection);
  });

  beforeEach(inject([WorkoutLogEntriesService], (service: WorkoutLogEntriesService) => {
    workoutLogEntries = service;
    // NOTE: User needs to be logged in for this service to be useful
    const afAuth = TestBed.inject(AngularFireAuth);
    (afAuth as any).auth.currentUser = { uid: '123abc' };
  }));

  it('should be created', () => {
    expect(workoutLogEntries).toBeTruthy();
  });

  describe('all', () => {
    it('grabs a reference to the daily-exercises collection for the user', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      workoutLogEntries.all();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('users');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('123abc');
      expect(doc.collection).toHaveBeenCalledTimes(1);
      expect(doc.collection).toHaveBeenCalledWith('workout-log-entries');
    });
  });

  describe('getAllForLog', () => {
    it('runs a query', async () => {
      await workoutLogEntries.getAllForLog('314PI159');
      expect(collection.ref.where).toHaveBeenCalledTimes(1);
      expect(collection.ref.where).toHaveBeenCalledWith('workoutLog.id', '==', '314PI159');
    });

    it('maps the results', async () => {
      collection.ref = createCollectionReferenceMock([
        createDocumentSnapshotMock({
          id: '314159',
          data: {
            workoutLog: { id: '314PI159', beginDate: new firestore.Timestamp(1563339600, 0) },
            exercise: {
              id: '420059399405',
              name: 'Squats',
              description: 'Not to be confused with squirts',
              area: 'Lower Body',
              type: 'Free Weights',
            },
            logDate: new firestore.Timestamp(1563512400, 0),
            reps: 12,
            sets: 4,
            weight: 150,
          },
        }),
        createDocumentSnapshotMock({
          id: '414608',
          data: {
            workoutLog: { id: '314PI159', beginDate: new firestore.Timestamp(1563339600, 0) },
            exercise: {
              id: '420059399405',
              name: 'Push Back',
              description: 'Find something you do not like, rebel against it',
              type: 'Body Weight',
              area: 'Core',
            },
            logDate: new firestore.Timestamp(1563512400, 0),
            reps: 8,
            sets: 6,
          },
        }),
      ]);
      const logs = await workoutLogEntries.getAllForLog('314PI159');
      expect(logs).toEqual([
        {
          id: '314159',
          workoutLog: { id: '314PI159', beginDate: new Date(1563339600000) },
          exercise: {
            id: '420059399405',
            name: 'Squats',
            description: 'Not to be confused with squirts',
            area: 'Lower Body',
            type: 'Free Weights',
          },
          logDate: new Date(1563512400000),
          reps: 12,
          sets: 4,
          weight: 150,
        },
        {
          id: '414608',
          workoutLog: { id: '314PI159', beginDate: new Date(1563339600000) },
          exercise: {
            id: '420059399405',
            name: 'Push Back',
            description: 'Find something you do not like, rebel against it',
            type: 'Body Weight',
            area: 'Core',
          },
          logDate: new Date(1563512400000),
          reps: 8,
          sets: 6,
        },
      ]);
    });
  });
});
