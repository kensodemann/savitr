import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { ExercisesService } from './exercises.service';
import {
  createAngularFirestoreMock,
  createAngularFirestoreCollectionMock
} from 'test/mocks';

describe('ExercisesService', () => {
  let collection;
  let exercises: ExercisesService;

  beforeEach(() => {
    const angularFirestore = createAngularFirestoreMock();
    collection = createAngularFirestoreCollectionMock();
    angularFirestore.collection.and.returnValue(collection);
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFirestore, useValue: angularFirestore }]
    });
  });

  beforeEach(inject([ExercisesService], (service: ExercisesService) => {
    exercises = service;
  }));

  it('should be created', () => {
    expect(exercises).toBeTruthy();
  });

  it('grabs a references to the exercises collection', () => {
    const angularFirestore = TestBed.get(AngularFirestore);
    expect(angularFirestore.collection).toHaveBeenCalledTimes(1);
    expect(angularFirestore.collection).toHaveBeenCalledWith('exercises');
  });
});
