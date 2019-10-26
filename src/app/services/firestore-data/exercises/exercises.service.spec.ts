import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { ExercisesService } from './exercises.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock,
  createAngularFireAuthMock
} from '@test/mocks';
import { AngularFireAuth } from '@angular/fire/auth';

describe('ExercisesService', () => {
  let collection;
  let exercises: ExercisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useFactory: createAngularFireAuthMock },
        { provide: AngularFirestore, useFactory: createAngularFirestoreMock }
      ]
    });
    const angularFirestore = TestBed.get(AngularFirestore);
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.mockReturnValue(collection);
  });

  beforeEach(inject([ExercisesService], (service: ExercisesService) => {
    exercises = service;
    const afAuth = TestBed.get(AngularFireAuth);
    afAuth.authState.next();
  }));

  it('should be created', () => {
    expect(exercises).toBeTruthy();
  });

  it('grabs a references to the exercises collection', () => {
    const angularFirestore = TestBed.get(AngularFirestore);
    exercises.all();
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('exercises');
  });
});
