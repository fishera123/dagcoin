import {NgModule} from '@angular/core';
import {IPromise} from 'q';
import {IProfileService} from '../services/profile/profile.service';

@NgModule({
  declarations: [ ],
  exports: [ ]
})
export class SharedModule {
  /*
  private static TRANSLATION_SERVICE: ITranslationService;
  private static LOCALE_SERVICE: LocaleService;
  private static ALERT_SERVICE: AlertService;
  */
  private static PROFILE_SERVICE: IProfileService;

  public static setProfileService(profileService: IProfileService) {
    SharedModule.PROFILE_SERVICE = profileService;
  }

  public static getProfileService() {
    return SharedModule.PROFILE_SERVICE;
  }

}
