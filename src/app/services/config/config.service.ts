import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { StorageService } from '../storage/storage.service';


@Injectable()
export class ConfigService {

  defaultConfig = {
    // wallet limits
    limits: {
      totalCosigners: 6,
    },
    hub: 'testnetexplorer.dagcoin.org/wss/',
    deviceName: 'test name',
    wallet: {
      requiredCosigners: 2,
      totalCosigners: 3,
      spendUnconfirmed: false,
      reconnectDelay: 5000,
      idleDurationMin: 4,
      settings: {
        unitName: 'bytes',
        unitValue: 1,
        unitDecimals: 0,
        unitCode: 'oneByte',
        dagUnitName: 'DAG',
        dagUnitValue: 1000000,
        dagUnitDecimals: 6,
        dagUnitCode: 'one',
        alternativeName: 'US Dollar',
        alternativeIsoCode: 'USD',
      },
    },
    rates: {
      url: 'https://insight.bitpay.com:443/api/rates',
    },
    pushNotifications: {
      enabled: true,
      config: {
        android: {
          icon: 'push',
          iconColor: '#2F4053',
        },
        ios: {
          alert: 'true',
          badge: 'true',
          sound: 'true',
        },
        windows: {},
      },
    },
    autoUpdateWitnessesList: true,
  };
  configCache = null;

  constructor(private storage: StorageService) { }

  getSync() {
    if (!this.configCache) {
      throw new Error('configService#getSync called when cache is not initialized');
    }
    return this.configCache;
  }

  get(cb) {
    this.storage.getConfig((err, localConfig) => {
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

      // $log.debug('Preferences read:', this.configCache);
      return cb(err, this.configCache);
    });
  }

  set(newOpts, cb) {
    let config = this.defaultConfig;
    this.storage.getConfig((err, oldOpts) => {
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
      this.configCache = config;

      this.storage.storeConfig(JSON.stringify(config), cb);
    });
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

    this.storage.storeConfig(JSON.stringify(config), cb);
  }

  // reset(cb) {
  //   this.configCache = _.clone(this.defaultConfig);
  //   this.storage.removeConfig(cb);
  // }

  getDefaults() {
    return _.clone(this.defaultConfig);
  }
}
