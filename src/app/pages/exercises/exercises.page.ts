import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Exercise } from 'src/app/models/exercise';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';
import { ExercisesService } from '@app/services/firestore-data';
import { yesNoButtons } from '@app/util';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss']
})
export class ExercisesPage implements OnInit {
  exercises$: Observable<Array<Exercise>>;

  constructor(
    private alertController: AlertController,
    public authentication: AuthenticationService,
    private exercisesService: ExercisesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.exercises$ = this.exercisesService.all();
  }

  async add(): Promise<void> {
    const modal = await this.modalController.create({
      backdropDismiss: false,
      component: ExerciseEditorComponent
    });
    modal.present();
    const res = await modal.onDidDismiss();
    if (res && res.role === 'save') {
      this.exercisesService.add(res.data);
    }
  }

  async edit(exercise: Exercise): Promise<void> {
    const modal = await this.modalController.create({
      backdropDismiss: false,
      component: ExerciseEditorComponent,
      componentProps: { exercise }
    });
    modal.present();
    const res = await modal.onDidDismiss();
    if (res && res.role === 'save') {
      this.exercisesService.update(res.data);
    }
  }

  async delete(exercise: Exercise): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remove Exercise?',
      subHeader: exercise.name,
      message: 'This action cannot be undone. Are you sure you want to continue?',
      buttons: yesNoButtons
    });
    alert.present();
    const result = await alert.onDidDismiss();
    if (result.role === 'confirm') {
      this.exercisesService.delete(exercise);
    }
  }
}
