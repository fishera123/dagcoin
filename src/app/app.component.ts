import { Component } from '@angular/core';
import {IProfileService, ProfileService} from './services/profile/profile.service';
import {SharedModule} from './_base/shared.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private profileService: ProfileService) {
    this.injectServicesIntoSharedModule();
  }

  private injectServicesIntoSharedModule() {
    SharedModule.setProfileService(this.profileService);
  }
}
