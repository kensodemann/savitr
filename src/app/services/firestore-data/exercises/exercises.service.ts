import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Exercise } from '@app/models/exercise';
import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService extends FirestoreDataService<Exercise> {
  constructor(private firestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  protected getCollection(): AngularFirestoreCollection<Exercise> {
    return this.firestore.collection('exercises');
  }
}
