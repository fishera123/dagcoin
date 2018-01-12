import {TestBed, inject, tick, fakeAsync} from '@angular/core/testing';

import { FileStorageService } from './file-storage.service';
import {Config} from '../../models/config.model';
import {ConfigService} from '../config/config.service';
import {MockConfigService} from '../../_test/mock.config.service';

describe('FileStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileStorageService]
    });
  });

  it('should be created', inject([FileStorageService], (service: FileStorageService) => {
    expect(service).toBeTruthy();
  }));

  /*
  it('should init', fakeAsync(inject([FileStorageService], (service: FileStorageService) => {
    const getPromise = service.init();
    expect(getPromise).toBeTruthy();
    tick();
    const test = new Config();
    getPromise
      .then((config: Config) => {
        expect(config).toBeTruthy();
        expect(config.deviceName).toEqual(MockConfigService.UNIT_TEST_DEVICE);
      })
      .catch((err) => {
      });
  })));
  */
});
