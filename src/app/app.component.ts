import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApplicationService } from '@app/services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Current',
      url: '/current',
      icon: 'home'
    },
    {
      title: 'History & Planning',
      url: '/history',
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
    private navController: NavController
  ) {}

  ngOnInit() {
    this.application.registerForUpdates();
    this.afAuth.authState.subscribe(u => {
      if (!u) {
        this.navController.navigateRoot(['login']);
      }
    });
  }
}
