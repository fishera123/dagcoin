import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import {CommonTestModuleMetadata} from '../../_test/common.test.module.metadata';
import {Utils} from '../../_base/utils';

describe('LocalStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(CommonTestModuleMetadata.createTestModuleMetadata());
  });

  it('should be created', inject([LocalStorageService], (service: LocalStorageService) => {
    expect(service).toBeTruthy();
  }));

  it('should get', fakeAsync(inject([LocalStorageService], (service: LocalStorageService) => {
    Utils.clearLocalStorage();
    const ls = typeof window.localStorage !== 'undefined' ? window.localStorage : null;
    expect(ls).toBeTruthy();
    ls.setItem('test', 'test-value');

    const getPromise = service.get('test');
    expect(getPromise).toBeTruthy();
    tick();
    getPromise.then((value => {
      expect(value).toEqual('test-value');
    }));
  })));

  it('should set', fakeAsync(inject([LocalStorageService], (service: LocalStorageService) => {
    Utils.clearLocalStorage();
    const ls = typeof window.localStorage !== 'undefined' ? window.localStorage : null;
    expect(ls).toBeTruthy();
    ls.setItem('test', 'test-value');

    const getPromise = service.get('test');
    expect(getPromise).toBeTruthy();
    tick();
    getPromise.then((value => {
      expect(value).toEqual('test-value');
    }));
  })));

  it('should create', fakeAsync(inject([LocalStorageService], (service: LocalStorageService) => {
    const ls = typeof window.localStorage !== 'undefined' ? window.localStorage : null;
    expect(ls).toBeTruthy();
    Utils.clearLocalStorage();

    const getPromise = service.create('new-key-test', 'new-test-value');
    expect(getPromise).toBeTruthy();
    tick();
    getPromise.then((value => {
      expect(value).toEqual(true);
    }));

    expect(ls.getItem('new-key-test')).toEqual('new-test-value');

  })));

  it('should not create', fakeAsync(inject([LocalStorageService], (service: LocalStorageService) => {

    const ls = typeof window.localStorage !== 'undefined' ? window.localStorage : null;
    expect(ls).toBeTruthy();
    Utils.clearLocalStorage();
    ls.setItem('test', 'test-value');

    const getPromise = service.create('test', 'new-test-value');
    expect(getPromise).toBeTruthy();
    let enteredThen = false;
    let enteredCatch = false;
    getPromise
      .then(value => {
        enteredThen = true;
      })
      .catch((value => {
        enteredCatch = true;
    }));
    tick();
    expect(enteredThen).toEqual(false);
    expect(enteredCatch).toEqual(true);
  })));
});
