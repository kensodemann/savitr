import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { User } from 'firebase';

import { Exercise } from '@app/models/exercise';
import { FirestoreDataService } from '../firestore-data.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService extends FirestoreDataService<Exercise> {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    super(afAuth);
  }

  protected getCollection(): AngularFirestoreCollection<Exercise> {
    return this.firestore.collection('exercises');
  }
}
