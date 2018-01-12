import {fakeAsync, inject, TestBed, tick} from '@angular/core/testing';

import {ProfileService} from './profile.service';
import {CommonTestModuleMetadata} from '../../_test/common.test.module.metadata';
import {Profile} from '../../models/profile.model';

describe('ProfileService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(CommonTestModuleMetadata.createTestModuleMetadata());
  });

  it('should be created', inject([ProfileService], (service: ProfileService) => {
    expect(service).toBeTruthy();
  }));


  // TODO fix the test, format amount can not pass, because this.configService.getSync() gives error not initialized cache
  /*
  it('should formatAmount', inject([ProfileService], (service: ProfileService) => {
    const amount = 3102.09;
    const asset = 'dag';
    expect(service.formatAmount(amount, asset, null)).toEqual('');
  }));
  */

  it('should create', fakeAsync(inject([ProfileService], (service: ProfileService) => {
    const createPromise = service.create({});
    tick();
    createPromise
      .then(value => {
        console.log(`ok :: value=${value}`);
      })
      .catch(err => console.log(err));
  })));

});
