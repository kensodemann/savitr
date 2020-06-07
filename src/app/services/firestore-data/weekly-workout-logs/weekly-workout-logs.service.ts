import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { FirestoreDataService } from '../firestore-data.service';
import { WorkoutLog } from '@app/models';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class WeeklyWorkoutLogsService extends FirestoreDataService<WorkoutLog> {
  constructor(private ngFirestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  protected getCollection(user?: firebase.User): AngularFirestoreCollection<WorkoutLog> {
    if (user) {
      return this.ngFirestore
        .collection('users')
        .doc(user.uid)
        .collection('weekly-workout-logs', ref => ref.orderBy('beginDate', 'desc'));
    }
  }

  protected actionsToData(actions: Array<DocumentChangeAction<WorkoutLog>>): Array<WorkoutLog> {
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return {
        id,
        beginDate: ((data as any).beginDate as firestore.Timestamp).toDate()
      };
    });
  }

  async get(id: string): Promise<WorkoutLog> {
    const doc = await super.get(id);
    if (doc && doc.beginDate) {
      doc.beginDate = new Date((doc.beginDate as any).seconds * 1000);
    }
    return doc;
  }

  async getForDate(dt: Date): Promise<WorkoutLog> {
    const user = await this.afAuth.currentUser;
    let doc;
    const value = await this.getCollection(user)
      .ref.where('beginDate', '==', dt)
      .get();

    if (value.size === 0) {
      const ref = await this.add({ beginDate: dt });
      doc = await ref.get();
    } else {
      doc = value.docs[0];
    }

    return {
      id: doc.id,
      beginDate: (doc.data().beginDate as firestore.Timestamp).toDate()
    };
  }
}
