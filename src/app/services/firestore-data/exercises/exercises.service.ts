import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Exercise } from '@app/models/exercise';
import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService extends FirestoreDataService<Exercise> {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  protected getCollection(): AngularFirestoreCollection<Exercise> {
    return this.firestore.collection('exercises');
  }
}
