import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IntroComponent } from './components/intro/intro.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { ProfileService } from './services/profile/profile.service';
import { SharedModule } from './_base/shared.module';
import {ConfigService} from './services/config/config.service';
import {FileStorageService} from './services/file-storage/file-storage.service';
import {LocalStorageService} from './services/local-storage/local-storage.service';
import {StorageService} from './services/storage/storage.service';


@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    SvgIconComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    ProfileService,
    ConfigService,
    StorageService,
    FileStorageService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
