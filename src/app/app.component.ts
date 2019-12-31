import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApplicationService } from '@app/services';
import { State } from './store';
import { loginChanged } from './store/actions/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Current',
      url: '/workout/current',
      icon: 'home'
    },
    {
      title: 'History & Planning',
      url: '/workout/history',
      icon: 'calendar'
    },
    {
      title: 'Exercises',
      url: '/exercises',
      icon: 'bicycle'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle-outline'
    }
  ];

  constructor(
    private afAuth: AngularFireAuth,
    private application: ApplicationService,
    private navController: NavController,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.application.registerForUpdates();
    this.afAuth.authState.subscribe(u => {
      this.store.dispatch(loginChanged({ email: u && u.email }));
      if (!u) {
        this.navController.navigateRoot(['login']);
      }
    });
  }
}
