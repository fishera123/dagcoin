import { Component } from '@angular/core';
import {ProfileService} from './services/profile/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(profileService: ProfileService) { }
}
