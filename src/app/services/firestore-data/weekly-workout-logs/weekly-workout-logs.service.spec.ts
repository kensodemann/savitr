import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { WeeklyWorkoutLogsService } from './weekly-workout-logs.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFirestoreDocumentMock,
  createAngularFireAuthMock
} from 'test/mocks';
import { AngularFireAuth } from '@angular/fire/auth';

describe('WeeklyWorkoutLogsService', () => {
  let collection;
  let doc;
  let weeklyWorkoutLogs: WeeklyWorkoutLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock }
      ]
    });
    const angularFirestore = TestBed.get(AngularFirestore);
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.and.returnValue(collection);
    doc = createAngularFirestoreDocumentMock();
    collection = createAngularFirestoreCollectionMock();
    collection.doc.and.returnValue(doc);
    doc.collection.and.returnValue(collection);
    angularFirestore.collection.and.returnValue(collection);
  });

  beforeEach(inject(
    [WeeklyWorkoutLogsService],
    (service: WeeklyWorkoutLogsService) => {
      weeklyWorkoutLogs = service;
    }
  ));

  it('should be created', () => {
    expect(weeklyWorkoutLogs).toBeTruthy();
  });

  describe('all', () => {
    beforeEach(() => {
      // NOTE: User needs to be logged in for this service to be useful
      const afAuth = TestBed.get(AngularFireAuth);
      afAuth.auth.currentUser = { uid: '123abc' };
    });

    it('grabs a references to the daily-exercises collection for the user', () => {
      const angularFirestore = TestBed.get(AngularFirestore);
      weeklyWorkoutLogs.all();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('users');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('123abc');
      expect(doc.collection).toHaveBeenCalledTimes(1);
      expect(doc.collection.calls.argsFor(0)[0]).toEqual('weekly-workout-logs');
    });
  });
});
