import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';

import { Exercise } from '@app/models';
import { ExercisesService } from '@app/services/firestore-data';

@Component({
  selector: 'app-exercise-finder',
  templateUrl: './exercise-finder.component.html',
  styleUrls: ['./exercise-finder.component.scss'],
})
export class ExerciseFinderComponent implements OnInit {
  private filterBy: BehaviorSubject<string>;

  exercises$: Observable<Array<Exercise>>;

  constructor(private exercisesService: ExercisesService, private modalController: ModalController) {
    this.filterBy = new BehaviorSubject('');
  }

  ngOnInit() {
    this.exercises$ = this.filterBy.pipe(
      flatMap((filter) =>
        this.exercisesService.all().pipe(
          map((exercises) =>
            exercises.filter((exercise) => {
              return exercise.name.toLocaleLowerCase().includes(filter);
            })
          )
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
