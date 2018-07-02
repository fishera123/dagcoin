import {Injectable} from '@angular/core';
import {IInternalStorageService} from '../storage/storage.service';
import {Reject} from '../../_base/reject';

@Injectable()
export class LocalStorageService implements IInternalStorageService {

  private static ls = ((typeof window.localStorage !== 'undefined') ? window.localStorage : null);

  constructor() {
  }

  get(key: string, cb?): Promise<string> {
    const __this = this;
    return new Promise(function(resolve, reject) {
      try {
        resolve(__this.getSync(key));
      } catch (e) {
        reject(e);
      }
    });
  }

  getSync = function (key) {
    return LocalStorageService.ls.getItem(key);
  };

  /**
   * Same as setItem, but fails if an item already exists
   */
  create(name: string, value: string, callback?): Promise<any> {
    const __this = this;
    return new Promise(function (resolve, reject) {
      try {
        console.log(`local-storage creating: ${name}`);
        if (__this.getSync(name)) {
          reject(new Reject(0, 'already in storage'));
        } else {
          __this.setSync(name, value);
          console.log(`local-storage created: ${name}`);
          resolve(value);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  set(key: string, value: any, cb?): Promise<any> {
    const __this = this;
    return new Promise(function (resolve, reject) {
      try {
        __this.setSync(key, value);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  setSync = function (key, value) {
    LocalStorageService.ls.setItem(key, value);
  };

  removeSync = function (key) {
    LocalStorageService.ls.removeItem(key);
  };

  remove(key: string, cb?): Promise<any> {
    const __this = this;
    return new Promise(function (resolve, reject) {
      try {
        __this.removeSync(key);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

}
