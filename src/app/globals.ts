import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable()
export class Globals {
  public static MAIN_TITLE = 'Dagcoin';
  public static EMAIL_REGEXP = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

}
