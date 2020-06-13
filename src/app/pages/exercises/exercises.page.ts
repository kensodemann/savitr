import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { Exercise } from 'src/app/models/exercise';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';
import { yesNoButtons } from '@app/util';
import { State, selectAllExercises } from '@app/store';
import { logout } from '@app/store/actions/auth.actions';
import { remove } from '@app/store/actions/exercise.actions';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss']
})
export class ExercisesPage implements OnInit {
  exercises$: Observable<Array<Exercise>>;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.exercises$ = this.store.pipe(select(selectAllExercises));
  }

  async add(): Promise<void> {
    const modal = await this.modalController.create({
      backdropDismiss: false,
      component: ExerciseEditorComponent
    });
    modal.present();
  }

  async edit(exercise: Exercise): Promise<void> {
    const modal = await this.modalController.create({
      backdropDismiss: false,
      component: ExerciseEditorComponent,
      componentProps: { exercise }
    });
    modal.present();
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
      this.store.dispatch(remove({ exercise }));
    }
  }

  logout() {
    this.store.dispatch(logout());
  }
}
