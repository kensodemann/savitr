import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { byName } from 'src/app/util';
import { exerciseFocusAreas } from 'src/app/default-data';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';
import { ExercisesService } from 'src/app/services/firestore-data/exercises/exercises.service';

interface AreaExercises {
  area: string;
  exercises: Array<Exercise>;
}
@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss']
})
export class ExercisesPage implements OnInit, OnDestroy {
  private exercisesSubscription: Subscription;

  exercisesByArea: Array<AreaExercises>;

  constructor(
    public authentication: AuthenticationService,
    private exercisesService: ExercisesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.exercisesSubscription = this.exercisesService
      .all()
      .subscribe(all => this.processExercises(all));
  }

  ngOnDestroy() {
    this.exercisesSubscription.unsubscribe();
  }

  async add(): Promise<void> {
    const modal = await this.modalController.create({ component: ExerciseEditorComponent });
    modal.present();
  }

  private processExercises(all: Array<Exercise>) {
    this.exercisesByArea = [];
    exerciseFocusAreas.forEach(area =>
      this.exercisesByArea.push(this.exercisesForArea(all, area))
    );
  }

  private exercisesForArea(all: Array<Exercise>, area: string): AreaExercises {
    return {
      area,
      exercises: all.filter(e => e.area === area).sort(byName)
    };
  }
}
