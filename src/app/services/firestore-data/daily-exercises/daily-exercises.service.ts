import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreDataService } from '../firestore-data.service';
import { DailyExercise } from '@app/models/daily-exercise';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DailyExercisesService extends FirestoreDataService<DailyExercise> {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    super();
  }

  protected getCollection(): AngularFirestoreCollection<DailyExercise> {
    if (this.afAuth.auth.currentUser) {
      return this.firestore
        .collection('users')
        .doc(this.afAuth.auth.currentUser.uid)
        .collection('daily-exercises');
    }
  }
}
