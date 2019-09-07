import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { WorkoutLogEntriesService } from './workout-log-entries.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFireAuthMock,
  createAngularFirestoreDocumentMock
} from 'test/mocks';
import { AngularFireAuth } from '@angular/fire/auth';

describe('DailyExercisesService', () => {
  let collection;
  let doc;
  let workoutLogEntries: WorkoutLogEntriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock }
      ]
    });
    const angularFirestore = TestBed.get(AngularFirestore);
    doc = createAngularFirestoreDocumentMock();
    collection = createAngularFirestoreCollectionMock();
    collection.doc.and.returnValue(doc);
    doc.collection.and.returnValue(collection);
    angularFirestore.collection.and.returnValue(collection);
  });

  beforeEach(inject([WorkoutLogEntriesService], (service: WorkoutLogEntriesService) => {
    workoutLogEntries = service;
  }));

  it('should be created', () => {
    expect(workoutLogEntries).toBeTruthy();
  });

  describe('all', () => {
    beforeEach(() => {
      // NOTE: User needs to be logged in for this service to be useful
      const afAuth = TestBed.get(AngularFireAuth);
      afAuth.auth.currentUser = { uid: '123abc' };
    });

    it('grabs a reference to the daily-exercises collection for the user', () => {
      const angularFirestore = TestBed.get(AngularFirestore);
      workoutLogEntries.all();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('users');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('123abc');
      expect(doc.collection).toHaveBeenCalledTimes(1);
      expect(doc.collection).toHaveBeenCalledWith('workout-log-entries');
    });
  });
});
