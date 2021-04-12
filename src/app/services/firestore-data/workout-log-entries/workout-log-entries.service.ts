import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { WorkoutLogEntry } from '@app/models';
import firebase from 'firebase/app';
import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root',
})
export class WorkoutLogEntriesService extends FirestoreDataService<WorkoutLogEntry> {
  constructor(private firestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  protected getCollection(user: firebase.User): AngularFirestoreCollection<WorkoutLogEntry> {
    return this.firestore
      .collection('users')
      .doc((user && user.uid) || 'unknown')
      .collection('workout-log-entries');
  }

  async getAllForLog(id: string): Promise<Array<WorkoutLogEntry>> {
    const user = await this.afAuth.currentUser;
    const collection = this.getCollection(user);
    const value = await collection.ref.where('workoutLog.id', '==', id).get();
    return value.docs.map((doc) => {
      const d: WorkoutLogEntry = {
        id: doc.id,
        ...(doc.data() as WorkoutLogEntry),
      };
      d.logDate = ((d.logDate as any) as firebase.firestore.Timestamp).toDate();
      d.workoutLog.beginDate = ((d.workoutLog.beginDate as any) as firebase.firestore.Timestamp).toDate();
      return d;
    });
  }
}
