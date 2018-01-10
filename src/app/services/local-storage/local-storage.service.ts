import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() {
  }

  ls = ((typeof window.localStorage !== 'undefined') ? window.localStorage : null);
  get = function (k, cb) {
    return cb(null, this.ls.getItem(k));
  };

  getSync = function (k) {
    return this.ls.getItem(k);
  };

  /**
   * Same as setItem, but fails if an item already exists
   */
  create = function (name, value, callback) {
    this.get(name,
      (err, data) => {
        if (data) {
          return callback('EXISTS');
        }
        return this.set(name, value, callback);
      });
  };

  set = function (k, v, cb) {
    this.ls.setItem(k, v);
    return cb();
  };

  setSync = function (k, v) {
    this.ls.setItem(k, v);
  };

  removeSync = function (k) {
    this.ls.removeItem(k);
  };

  remove = function (k, cb) {
    this.ls.removeItem(k);
    return cb();
  };


}
