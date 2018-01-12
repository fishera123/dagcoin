import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';
import {CommonTestModuleMetadata} from '../../_test/common.test.module.metadata';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(CommonTestModuleMetadata.createTestModuleMetadata());
  });

  it('should be created', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));
});
