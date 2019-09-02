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
  constructor(private firestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  protected getCollection(u: User): AngularFirestoreCollection<DailyExercise> {
    if (u) {
      return this.firestore
        .collection('users')
        .doc(u.uid)
        .collection('daily-exercises');
    }
  }
}
