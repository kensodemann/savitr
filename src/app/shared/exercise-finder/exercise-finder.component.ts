import { Component, OnInit } from '@angular/core';
import { Exercise } from '@app/models';
import { ExercisesService } from '@app/services/firestore-data';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-exercise-finder',
  templateUrl: './exercise-finder.component.html',
  styleUrls: ['./exercise-finder.component.scss'],
})
export class ExerciseFinderComponent implements OnInit {
  exercises$: Observable<Array<Exercise>>;

  private filterBy: BehaviorSubject<string>;

  constructor(private exercisesService: ExercisesService, private modalController: ModalController) {
    this.filterBy = new BehaviorSubject('');
  }

  ngOnInit() {
    this.exercises$ = this.filterBy.pipe(
      mergeMap((filter) =>
        this.exercisesService
          .all()
          .pipe(map((exercises) => exercises.filter((exercise) => exercise.name.toLocaleLowerCase().includes(filter))))
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
