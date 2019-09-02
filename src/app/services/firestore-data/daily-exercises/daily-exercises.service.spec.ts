import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { DailyExercisesService } from './daily-exercises.service';
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
  let dailyExercises: DailyExercisesService;

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

  beforeEach(inject([DailyExercisesService], (service: DailyExercisesService) => {
    dailyExercises = service;
  }));

  it('should be created', () => {
    expect(dailyExercises).toBeTruthy();
  });

  describe('all', () => {
    beforeEach(() => {
      // NOTE: User needs to be logged in for this service to be useful
      const afAuth = TestBed.get(AngularFireAuth);
      afAuth.auth.currentUser = { uid: '123abc' };
    });

    it('grabs a reference to the daily-exercises collection for the user', () => {
      const angularFirestore = TestBed.get(AngularFirestore);
      dailyExercises.all();
      expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
      expect(angularFirestore.collection).toHaveBeenCalledWith('users');
      expect(collection.doc).toHaveBeenCalledTimes(1);
      expect(collection.doc).toHaveBeenCalledWith('123abc');
      expect(doc.collection).toHaveBeenCalledTimes(1);
      expect(doc.collection).toHaveBeenCalledWith('daily-exercises');
    });
  });
});
