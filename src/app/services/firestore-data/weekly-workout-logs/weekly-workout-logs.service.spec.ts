import { inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  createAction,
  createAngularFireAuthMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFirestoreMock,
  createCollectionReferenceMock,
  createDocumentReferenceMock,
  createDocumentSnapshotMock,
} from '@test/mocks';
import firebase from 'firebase/app';
import { of } from 'rxjs';
import { WeeklyWorkoutLogsService } from './weekly-workout-logs.service';

describe('WeeklyWorkoutLogsService', () => {
  let logsCollection: any;
  let userCollection: any;
  let userDoc: any;
  let weeklyWorkoutLogs: WeeklyWorkoutLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock },
      ],
    });
    const angularFirestore = TestBed.inject(AngularFirestore);
    userCollection = createAngularFirestoreCollectionMock();
    (angularFirestore.collection as any).mockReturnValue(userCollection);
    userDoc = createAngularFirestoreDocumentMock();
    userCollection = createAngularFirestoreCollectionMock();
    userCollection.doc.mockReturnValue(userDoc);
    logsCollection = createAngularFirestoreCollectionMock();
    userDoc.collection.mockReturnValue(logsCollection);
    (angularFirestore.collection as any).mockReturnValue(userCollection);
  });

  beforeEach(inject([WeeklyWorkoutLogsService], (service: WeeklyWorkoutLogsService) => {
    weeklyWorkoutLogs = service;
    // NOTE: User needs to be logged in for this service to be useful
    const afAuth = TestBed.inject(AngularFireAuth);
    (afAuth as any).currentUser = { uid: '123abc' };
    (afAuth as any).user = of({ uid: '123abc' });
    (afAuth.authState as any).next();
  }));

  it('should be created', () => {
    expect(weeklyWorkoutLogs).toBeTruthy();
  });

  describe('all', () => {
    it('grabs a references to the daily-exercises collection for the user', () => {
      const angularFirestore = TestBed.inject(AngularFirestore);
      weeklyWorkoutLogs.all().subscribe();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('users');
      expect(userCollection.doc).toHaveBeenCalledTimes(1);
      expect(userCollection.doc).toHaveBeenCalledWith('123abc');
      expect(userDoc.collection).toHaveBeenCalledTimes(1);
      expect(userDoc.collection.mock.calls[0][0]).toEqual('weekly-workout-logs');
    });

    it('translates Timestamps to Dates', (done) => {
      logsCollection.snapshotChanges.mockReturnValue(
        of([
          createAction('314PI', {
            beginDate: new firebase.firestore.Timestamp(1563339600, 0),
          }),
          createAction('420HI', {
            beginDate: new firebase.firestore.Timestamp(1563445900, 0),
          }),
        ])
      );
      weeklyWorkoutLogs.all().subscribe((l) => {
        expect(l).toEqual([
          {
            id: '314PI',
            beginDate: new Date(1563339600000),
          },
          {
            id: '420HI',
            beginDate: new Date(1563445900000),
          },
        ]);
        done();
      });
    });
  });

  describe('get', () => {
    let document: any;
    beforeEach(() => {
      document = createAngularFirestoreDocumentMock();
      logsCollection.doc.mockReturnValue(document);
    });

    it('translates from Firestore Timestamp to Date', async () => {
      const date = new Date('2019-08-14T00:00:00.000000');
      const seconds = date.getTime() / 1000;
      const snapshot = createDocumentSnapshotMock();
      snapshot.data.mockReturnValue({
        beginDate: {
          seconds,
        },
      });
      document.ref.get.mockReturnValue(snapshot);
      expect(await weeklyWorkoutLogs.get('123abc')).toEqual({
        id: '123abc',
        beginDate: date,
      });
    });
  });

  describe('getForDate', () => {
    let newLog: any;
    beforeEach(() => {
      newLog = createDocumentReferenceMock({
        id: '4273',
        data: { beginDate: new firebase.firestore.Timestamp(1563339600, 0) },
      });
      logsCollection.add.mockResolvedValue(newLog);
    });

    it('runs a query', async () => {
      const dt = new Date(1563339600000);
      await weeklyWorkoutLogs.getForDate(dt);
      expect(logsCollection.ref.where).toHaveBeenCalledTimes(1);
      expect(logsCollection.ref.where).toHaveBeenCalledWith('beginDate', '==', dt);
    });

    it('returns the first log found by the query', async () => {
      const dt = new Date(1563339600000);
      logsCollection.ref = createCollectionReferenceMock([
        createDocumentSnapshotMock({
          id: '314159',
          data: { beginDate: new firebase.firestore.Timestamp(1563339600, 0) },
        }),
        createDocumentSnapshotMock({
          id: '414608290262',
          data: { beginDate: new firebase.firestore.Timestamp(1563339600, 0) },
        }),
      ]);
      const log = await weeklyWorkoutLogs.getForDate(dt);
      expect(log).toEqual({ id: '314159', beginDate: dt });
    });

    describe('when no log exists', () => {
      it('creates a new log', async () => {
        const dt = new Date(1563339600000);
        await weeklyWorkoutLogs.getForDate(dt);
        expect(logsCollection.add).toHaveBeenCalledTimes(1);
        expect(logsCollection.add).toHaveBeenCalledWith({ beginDate: dt });
      });

      it('resolves to the newly created log', async () => {
        const dt = new Date(1563339600000);
        const log = await weeklyWorkoutLogs.getForDate(dt);
        expect(log).toEqual({ id: '4273', beginDate: new Date(1563339600000) });
      });
    });
  });
});
