import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreDataService } from '../firestore-data.service';
import { WorkoutLogEntry } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class WorkoutLogEntriesService extends FirestoreDataService< WorkoutLogEntry> {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    super();
  }

  protected getCollection(): AngularFirestoreCollection<WorkoutLogEntry> {
    if (this.afAuth.auth.currentUser) {
      return this.firestore
        .collection('users')
        .doc(this.afAuth.auth.currentUser.uid)
        .collection('workout-log-entries');
    }
  }
}
