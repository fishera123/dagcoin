import {Injectable} from '@angular/core';
import {APIs} from './wallet-client/lib/api';


@Injectable()
export class BwcService {

  constructor(private api: APIs) {
    console.log(this.api);
  }

  getClient(): APIs {
    return this.api;
  }
}
