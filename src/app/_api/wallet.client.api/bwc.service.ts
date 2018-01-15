import { Injectable } from '@angular/core';
import { API } from './wallet-client/lib/api';


@Injectable()
export class BwcService {

  constructor(private api: API) {
    console.log(this.api);
  }

  getClient(): API {
    return this.api;
  }
}
