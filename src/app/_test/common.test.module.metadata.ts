import {HttpClient, HttpHandler} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../_base/shared.module';
import {ConfigService} from '../services/config/config.service';
import {FileStorageService} from '../services/file-storage/file-storage.service';
import {LocalStorageService} from '../services/local-storage/local-storage.service';
import {ProfileService} from '../services/profile/profile.service';
import {StorageService} from '../services/storage/storage.service';
import {MockConfigService} from './mock.config.service';

export class CommonTestModuleMetadata {

  public static createTestModuleMetadata() {
    return {
      imports: [RouterTestingModule,
        SharedModule
      ],
      providers: [
        HttpClient,
        HttpHandler,
        ProfileService,
        ConfigService,
        //{provide: ConfigService, useValue: new MockConfigService()},
        StorageService,
        FileStorageService,
        LocalStorageService
      ]
    };
  }

}
