import { Component } from '@angular/core';

import { version } from '@app/default-data';
import { Version } from '@app/models/version';
import { Store } from '@ngrx/store';
import { State } from '@app/store';
import { logout } from '@app/store/actions/auth.actions';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss']
})
export class AboutPage {
  appVersion: Version = version;
  constructor(private store: Store<State>) {}

  logout() {
    this.store.dispatch(logout());
  }
}
