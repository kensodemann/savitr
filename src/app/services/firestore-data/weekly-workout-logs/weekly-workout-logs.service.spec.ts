import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { WeeklyWorkoutLogsService } from './weekly-workout-logs.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFireAuthMock,
  createDocumentSnapshotMock
} from '@test/mocks';
import { AngularFireAuth } from '@angular/fire/auth';

describe('WeeklyWorkoutLogsService', () => {
  let logsCollection;
  let userCollection;
  let userDoc;
  let weeklyWorkoutLogs: WeeklyWorkoutLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock }
      ]
    });
    const angularFirestore = TestBed.get(AngularFirestore);
    userCollection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.mockReturnValue(userCollection);
    userDoc = createAngularFirestoreDocumentMock();
    userCollection = createAngularFirestoreCollectionMock();
    userCollection.doc.mockReturnValue(userDoc);
    logsCollection = createAngularFirestoreCollectionMock();
    userDoc.collection.mockReturnValue(logsCollection);
    angularFirestore.collection.mockReturnValue(userCollection);
  });

  beforeEach(inject([WeeklyWorkoutLogsService], (service: WeeklyWorkoutLogsService) => {
    weeklyWorkoutLogs = service;
    // NOTE: User needs to be logged in for this service to be useful
    const afAuth = TestBed.get(AngularFireAuth);
    afAuth.auth.currentUser = { uid: '123abc' };
  }));

  it('should be created', () => {
    expect(weeklyWorkoutLogs).toBeTruthy();
  });

  describe('all', () => {
    it('grabs a references to the daily-exercises collection for the user', () => {
      const angularFirestore = TestBed.get(AngularFirestore);
      weeklyWorkoutLogs.all();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('users');
      expect(userCollection.doc).toHaveBeenCalledTimes(1);
      expect(userCollection.doc).toHaveBeenCalledWith('123abc');
      expect(userDoc.collection).toHaveBeenCalledTimes(1);
      expect(userDoc.collection.mock.calls[0][0]).toEqual('weekly-workout-logs');
    });
  });

  describe('get', () => {
    let document;
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
          seconds
        }
      });
      document.ref.get.mockReturnValue(snapshot);
      expect(await weeklyWorkoutLogs.get('123abc')).toEqual({
        id: '123abc',
        beginDate: date
      });
    });
  });
});
