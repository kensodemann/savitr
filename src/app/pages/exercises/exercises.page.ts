import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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
    private alertController: AlertController,
    public authentication: AuthenticationService,
    private exercisesService: ExercisesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.exercisesSubscription = this.exercisesService.all().subscribe(all => this.processExercises(all));
  }

  ngOnDestroy() {
    this.exercisesSubscription.unsubscribe();
  }

  async add(): Promise<void> {
    const modal = await this.modalController.create({ component: ExerciseEditorComponent });
    modal.present();
  }

  async edit(exercise: Exercise): Promise<void> {
    const modal = await this.modalController.create({ component: ExerciseEditorComponent, componentProps: { exercise } });
    modal.present();
  }

  async delete(exercise: Exercise): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remove Exercise?',
      subHeader: exercise.name,
      message: 'This action cannot be undone. Are you sure you want to continue?',
      buttons: [{ text: 'Yes', role: 'confirm' }, { text: 'No', role: 'cancel' }]
    });
    alert.present();
    const result = await alert.onDidDismiss();
    if (result.role === 'confirm') {
      this.exercisesService.delete(exercise);
    }
  }

  private processExercises(all: Array<Exercise>) {
    this.exercisesByArea = [];
    exerciseFocusAreas.forEach(area => this.exercisesByArea.push(this.exercisesForArea(all, area)));
  }

  private exercisesForArea(all: Array<Exercise>, area: string): AreaExercises {
    return {
      area,
      exercises: all.filter(e => e.area === area).sort(byName)
    };
  }
}
