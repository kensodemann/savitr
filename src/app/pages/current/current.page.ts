import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-current',
  templateUrl: './current.page.html',
  styleUrls: ['./current.page.scss'],
})
export class CurrentPage implements OnInit {

  constructor(public authentication: AuthenticationService) { }

  ngOnInit() {
  }

}
