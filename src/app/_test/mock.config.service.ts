import {Injectable} from '@angular/core';
import {IConfigService} from '../services/config/config.service';
import {Config} from '../models/config.model';

@Injectable()
export class MockConfigService implements IConfigService {

  public static UNIT_TEST_DEVICE = 'unit-test-device';

  defaultConfig: Config;
  configCache: Config;

  constructor() {
    this.defaultConfig = new Config();
  }

  get(): Promise<any> {
    const __this = this;
    return new Promise(function(resolve, reject) {
      const config = new Config();
      config.deviceName = MockConfigService.UNIT_TEST_DEVICE;
      resolve(config);
    });
  }

  getSync(): any {
    return {
      wallet: {
        settings: {
          dagUnitCode: 'DAG'
          // ,unitCode
        }
      }
    };
  }

  set(newOpts: any): Promise<any> {
    return undefined;
  }


}
