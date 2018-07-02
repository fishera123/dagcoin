import {OnInit} from '@angular/core';
import {SharedModule} from './shared.module';
import {IProfileService} from '../services/profile/profile.service';
import {Globals} from '../globals';

/**
 * Base classes of all components used in application<br>
 * This class has helper methods for common services, values.<br>
 * Common component behaviours and values should be added to this class<br>
 * For example;
 * <li>Central access to common services (TranslationService, Title, AlertService etc.)
 * <li>translate method
 *
 */
export abstract class BaseComponent {

  constructor () { }

  public getProfileService(): IProfileService {
    return SharedModule.getProfileService();
  }

  /**
   *
   * @param {string} key
   * @param args
   * @returns {string} translated string according to current language
   */
  public translate (key: string, args?: any): string {
    // return this.getTranslationService().translate(key, args, this.getLocaleService().getCurrentLanguage());
    return undefined;
  }

  /**
   * can be used in templates directly
   * @returns {RegExp}
   * @constructor
   */
  get EMAIL_REGEXP(): RegExp {
    return Globals.EMAIL_REGEXP;
  }

}
