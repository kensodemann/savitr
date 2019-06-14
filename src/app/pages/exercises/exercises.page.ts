import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ModalController } from '@ionic/angular';
import { ExerciseEditorComponent } from 'src/app/editors/exercise-editor/exercise-editor.component';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss']
})
export class ExercisesPage implements OnInit {
  constructor(public authentication: AuthenticationService, private modalController: ModalController) {}

  ngOnInit() {}

  async add(): Promise<void> {
    const modal = await this.modalController.create({ component: ExerciseEditorComponent });
    modal.present();
  }
}
