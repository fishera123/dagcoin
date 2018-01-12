import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {ConfigService} from './config.service';
import {CommonTestModuleMetadata} from '../../_test/common.test.module.metadata';
import {Config} from '../../models/config.model';
import {MockConfigService} from '../../_test/mock.config.service';
import {Utils} from '../../_base/utils';

describe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(CommonTestModuleMetadata.createTestModuleMetadata());
  });

  it('should be created', inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));

  it('should get', fakeAsync(inject([ConfigService], (service: ConfigService) => {
    Utils.clearLocalStorage();
    const getPromise = service.get();
    expect(getPromise).toBeTruthy();
    tick();
    const test = new Config();
    getPromise
      .then((config: Config) => {
        expect(config).toBeTruthy();
        expect(config.deviceName).toEqual(Config.DEFAULT_DEVICE_NAME);
      })
      .catch((err) => {
      });
  })));

  it('should set', fakeAsync(inject([ConfigService], (service: ConfigService) => {
    Utils.clearLocalStorage();

    const newOptions = new Config();
    newOptions.deviceName = 'new-device-name';
    const setPromise = service.set(newOptions);
    expect(setPromise).toBeTruthy();
    tick();
    const test = new Config();
    setPromise
      .then(value => {
        console.log(`then 1 config written: ${value}`);
        return value;
      })
      .then(value => {
        console.log(`then 2 config being checked: ${value}`);
        const ls = typeof window.localStorage !== 'undefined' ? window.localStorage : null;
        expect(JSON.parse(ls.getItem('config')).deviceName).toEqual('new-device-name');
      });

  })));

});
