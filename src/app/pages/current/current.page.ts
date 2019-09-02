import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services';

@Component({
  selector: 'app-current',
  templateUrl: './current.page.html',
  styleUrls: ['./current.page.scss']
})
export class CurrentPage implements OnInit {
  currentView: string;

  constructor(public authentication: AuthenticationService) {}

  ngOnInit() {
    this.currentView = 'today';
  }

  segmentChanged(ev) {
    // Note: may want to store the last selected value here and then
    //       restore it in ngOnInit
  }
}
