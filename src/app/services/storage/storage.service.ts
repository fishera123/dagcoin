import { Injectable } from '@angular/core';
import { FileStorageService } from '../file-storage/file-storage.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import * as sjcl from 'sjcl';
import {Config} from '../../models/config.model';
import {Profile} from '../../models/profile.model';

export interface IInternalStorageService {
  get(key: string, cb?): Promise<string>;
  set(key: string, value: any, cb?): Promise<any>;
  remove(key: string, cb?): Promise<any>;
  create(name: string, value: any, cb?): Promise<any>;
}

export interface IStorageService {
  getConfig(): Promise<string>;
  storeConfig(): Promise<any>;
  storeNewProfile(profile: any): Promise<any>;
}

@Injectable()
export class StorageService {

  storage: IInternalStorageService;

  constructor(private fileStorage: FileStorageService,
              private localStorage: LocalStorageService) {
    this.storage = this.shouldUseFileStorage ? this.fileStorage : this.localStorage;
  }

  // File storage is not supported for writting according to
  // https://github.com/apache/cordova-plugin-file/#supported-platforms
  shouldUseFileStorage = false;
  // $log.debug('Using file storage:', shouldUseFileStorage);

  static encryptOnMobile(text, cb) {
    // UUID encryption is disabled.
    return cb(null, text);
    //
    // getUUID(function(uuid) {
    //   if (uuid) {
    //     $log.debug('Encrypting profile');
    //     text = sjcl.encrypt(uuid, text);
    //   }
    //   return cb(null, text);
    // });
  }


  decryptOnMobile = function (text, cb) {
    let json;
    let inputText;
    try {
      json = JSON.parse(text);
    } catch (e) {
      // $log.warn(e);
    }

    if (!json) {
      return cb('Could not access storage');
    }

    if (!json.iter || !json.ct) {
      // $log.debug('Profile is not encrypted');
      return cb(null, text);
    }

    // $log.debug('Profile is encrypted');
    return this.getUUID((uuid) => {
      // $log.debug(`Device UUID:${uuid}`);
      if (!uuid) {
        return cb('Could not decrypt storage: could not get device ID');
      }

      try {
        inputText = sjcl.decrypt(uuid, text);

        // $log.info('Migrating to unencrypted profile');
        return this.storage.set('profile', inputText, err => cb(err, inputText));
      } catch (e) {
        // $log.warn('Decrypt error: ', e);
        return cb('Could not decrypt storage: device ID mismatch');
      }
      // return cb(null, text);
    });
  };

  // on mobile, the storage keys are files, we have to avoid slashes in filenames
  getSafeWalletId(walletId) {
    return walletId.replace(/[\/+=]/g, '');
  }

  storeNewProfile(profile: any, cb?): Promise<any> {
    /*
    StorageService.encryptOnMobile(profile.toObj(), (err, x) => {
      this.storage.create('profile', x, cb);
    });
    */
    return this.storage.create('profile', profile);
  }

  storeProfile(profile, cb) {
    StorageService.encryptOnMobile(profile.toObj(), (err, x) => {
      this.storage.set('profile', x, cb);
    });
  }

  // getProfile(cb) {
  //   this.storage.get('profile', (err, str) => {
  //     // console.log("prof="+str+", err="+err);
  //     if (err || !str) {
  //       return cb(err);
  //     }
  //
  //     return this.decryptOnMobile(str, (decryptOnMobileError, profileStr) => {
  //       if (decryptOnMobileError) {
  //         return cb(decryptOnMobileError);
  //       }
  //       let p;
  //       let profileError;
  //       try {
  //         p = Profile.fromString(profileStr);
  //       } catch (e) {
  //         // $log.debug('Could not read profile:', e);
  //         profileError = new Error(`Could not read profile:${e}`);
  //       }
  //       return cb(profileError, p);
  //     });
  //   });
  // }

  deleteProfile(cb) {
    this.storage.remove('profile', cb);
  }

  storeFocusedWalletId(id, cb) {
    this.storage.set('focusedWalletId', id || '', cb);
  }

  getFocusedWalletId(cb) {
    this.storage.get('focusedWalletId', cb);
  }

  setBackupFlag(walletId, cb) {
    this.storage.set(`backup-${this.getSafeWalletId(walletId)}`, Date.now(), cb);
  }

  getBackupFlag(walletId, cb) {
    this.storage.get(`backup-${this.getSafeWalletId(walletId)}`, cb);
  }

  clearBackupFlag(walletId, cb) {
    this.storage.remove(`backup-${this.getSafeWalletId(walletId)}`, cb);
  }

  getConfig(): Promise<string> {
    return this.storage.get('config');
  }

  storeConfig(val): Promise<any> {
    // $log.debug('Storing Preferences', val);
    return this.storage.set('config', val);
  }

  clearConfig(cb) {
    this.storage.remove('config', cb);
  }

  setDisclaimerFlag(cb) {
    this.storage.set('agreeDisclaimer', true, cb);
  }

  getDisclaimerFlag(cb) {
    this.storage.get('agreeDisclaimer', cb);
  }

  setRemotePrefsStoredFlag(cb) {
    this.storage.set('remotePrefStored', true, cb);
  }

  getRemotePrefsStoredFlag(cb) {
    this.storage.get('remotePrefStored', cb);
  }

  setAddressbook(network, addressbook, cb) {
    this.storage.set(`addressbook-${network}`, addressbook, cb);
  }

  getAddressbook(network, cb) {
    this.storage.get(`addressbook-${network}`, cb);
  }

  removeAddressbook(network, cb) {
    this.storage.remove(`addressbook-${network}`, cb);
  }

  setPushInfo(projectNumber, registrationId, enabled, cb) {
    this.storage.set('pushToken', JSON.stringify({ projectNumber, registrationId, enabled }), cb);
  }

  getPushInfo(cb) {
    this.storage.get('pushToken', (err, data) => {
      if (err) {
        return cb(err);
      }
      return cb(null, (data ? JSON.parse(data) : data));
    });
  }

  removePushInfo(cb) {
    this.storage.remove('pushToken', cb);
  }
}
