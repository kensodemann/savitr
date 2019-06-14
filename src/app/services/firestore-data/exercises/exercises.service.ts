import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Exercise } from '../../../models/exercise';

import { FirestoreDataService } from '../firestore-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService extends FirestoreDataService<Exercise> {
  constructor(firestore: AngularFirestore) {
    super(firestore, 'exercises');
  }
}
