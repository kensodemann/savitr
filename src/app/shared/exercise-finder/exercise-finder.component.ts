import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';

import { Exercise } from '@app/models';
import { selectAllExercises, State } from '@app/store';

@Component({
  selector: 'app-exercise-finder',
  templateUrl: './exercise-finder.component.html',
  styleUrls: ['./exercise-finder.component.scss']
})
export class ExerciseFinderComponent implements OnInit {
  private filterBy: BehaviorSubject<string>;

  exercises$: Observable<Array<Exercise>>;

  constructor(private modalController: ModalController, private store: Store<State>) {
    this.filterBy = new BehaviorSubject('');
  }

  ngOnInit() {
    this.exercises$ = this.filterBy.pipe(
      flatMap(filter =>
        this.store.pipe(
          select(selectAllExercises),
          map(exercises => exercises.filter(exercise => exercise.name.toLocaleLowerCase().includes(filter)))
        )
      )
    );
  }

  applyFilter(value: string) {
    this.filterBy.next(value.toLocaleLowerCase());
  }

  select(exercise: Exercise) {
    this.modalController.dismiss(exercise, 'select');
  }
}
