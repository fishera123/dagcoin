import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {StorageService} from '../storage/storage.service';
import {Config} from '../../models/config.model';

export interface IConfigService {
  getSync(): any;
  get(): Promise<Config>;
  set(newOpts: any): Promise<any>;

  // TODO add other declarations
}

@Injectable()
export class ConfigService implements IConfigService {

  defaultConfig: Config;
  configCache = null;

  constructor(private storage: StorageService) {
    this.defaultConfig = new Config();
  }

  getSync() {
    if (!this.configCache) {
      return this.defaultConfig;
      // throw new Error('configService#getSync called when cache is not initialized');
    }
    return this.configCache;
  }

  get(): Promise<Config> {
    const $self = this;
    const promise: Promise<string> = this.storage.getConfig();

    return new Promise(function (resolve, reject) {
      resolve(promise.then(value => {
        $self.getLocalConfig(value);
        return $self.configCache;
      }));
    });
  }

  set(newOpts: any): Promise<any> {
    const $self = this;
    let config = this.defaultConfig;
    const promise: Promise<string> = this.storage.getConfig();

    return new Promise(function (resolve, reject) {
      resolve(promise.then(oldOpts => {
        let oldOptions;
        let newOptions = newOpts;
        if (_.isString(oldOpts)) {
          oldOptions = JSON.parse(oldOpts);
        }
        if (_.isString(config)) {
          config = JSON.parse(config);
        }
        if (_.isString(newOptions)) {
          newOptions = JSON.parse(newOptions);
        }
        _.merge(config, oldOptions, newOptions);
        $self.configCache = config;

        return $self.storage.storeConfig(JSON.stringify(config));
      }));
    });
  }

  private getLocalConfig(localConfig) {
    if (localConfig) {
      this.configCache = JSON.parse(localConfig);

      // these ifs are to avoid migration problems
      if (!this.configCache.wallet) {
        this.configCache.wallet = this.defaultConfig.wallet;
      }
      if (!this.configCache.wallet.settings.unitCode) {
        this.configCache.wallet.settings.unitCode = this.defaultConfig.wallet.settings.unitCode;
      }
      if (!this.configCache.wallet.settings.unitValue) {
        if (this.configCache.wallet.settings.unitToBytes) {
          this.configCache.wallet.settings.unitValue = this.configCache.wallet.settings.unitToBytes;
        } else {
          this.configCache.wallet.settings.unitValue = this.defaultConfig.wallet.settings.unitValue;
        }
      }
      if (!this.configCache.wallet.settings.dagUnitName) {
        this.configCache.wallet.settings.dagUnitName = this.defaultConfig.wallet.settings.dagUnitName;
      }
      if (!this.configCache.wallet.settings.dagUnitValue) {
        this.configCache.wallet.settings.dagUnitValue = this.defaultConfig.wallet.settings.dagUnitValue;
      }
      if (!this.configCache.wallet.settings.dagUnitDecimals) {
        this.configCache.wallet.settings.dagUnitDecimals = this.defaultConfig.wallet.settings.dagUnitDecimals;
      }
      if (!this.configCache.wallet.settings.dagUnitCode) {
        this.configCache.wallet.settings.dagUnitCode = this.defaultConfig.wallet.settings.dagUnitCode;
      }
      if (!this.configCache.pushNotifications) {
        this.configCache.pushNotifications = this.defaultConfig.pushNotifications;
      }
      if (!this.configCache.hub) {
        this.configCache.hub = this.defaultConfig.hub;
      }
      if (!this.configCache.deviceName) {
        this.configCache.deviceName = this.defaultConfig.deviceName;
      }
    } else {
      this.configCache = _.clone(this.defaultConfig);
      this.configCache.deviceName = this.defaultConfig.deviceName;
    }
  }

  setWithoutMergingOld(newOpts, cb) {
    let config = this.defaultConfig;
    let newOptions = newOpts;

    if (_.isString(config)) {
      config = JSON.parse(config);
    }
    if (_.isString(newOptions)) {
      newOptions = JSON.parse(newOptions);
    }
    _.merge(config, newOptions);
    this.configCache = config;

    this.storage.storeConfig(JSON.stringify(config));
  }

  // reset(cb) {
  //   this.configCache = _.clone(this.defaultConfig);
  //   this.storage.removeConfig(cb);
  // }

  getDefaults() {
    return _.clone(this.defaultConfig);
  }
}
