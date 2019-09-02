import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction
} from '@angular/fire/firestore';
import { User, firestore } from 'firebase';

import { FirestoreDataService } from '../firestore-data.service';
import { WorkoutLog } from '@app/models';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class WeeklyWorkoutLogsService extends FirestoreDataService<WorkoutLog> {
  constructor(private firestore: AngularFirestore, afAuth: AngularFireAuth) {
    super(afAuth);
  }

  protected getCollection(u: User): AngularFirestoreCollection<WorkoutLog> {
    if (u) {
      return this.firestore
        .collection('users')
        .doc(u.uid)
        .collection('weekly-workout-logs', ref =>
          ref.orderBy('beginDate', 'desc')
        );
    }
  }

  protected actionsToData(
    actions: Array<DocumentChangeAction<WorkoutLog>>
  ): Array<WorkoutLog> {
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return {
        id,
        beginDate: new Date(
          ((data as any).beginDate as firestore.Timestamp).seconds * 1000
        )
      };
    });
  }

  async getForDate(dt: Date): Promise<WorkoutLog> {
    let doc;
    const value = await this.collection.ref.where('beginDate', '==', dt).get();

    if (value.size === 0) {
      const ref = await this.add({ beginDate: dt });
      doc = await ref.get();
    } else {
      doc = value.docs[0];
    }

    return {
      id: doc.id,
      beginDate: new Date(doc.data().beginDate.seconds * 1000)
    };
  }
}
