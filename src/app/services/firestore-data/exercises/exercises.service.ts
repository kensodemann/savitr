import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Exercise } from '@app/models/exercise';
import { FirestoreDataService } from '../firestore-data.service';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService extends FirestoreDataService<Exercise> {
  constructor(private firestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  protected getCollection(user: firebase.User): AngularFirestoreCollection<Exercise> {
    return this.firestore.collection('exercises');
  }
}
