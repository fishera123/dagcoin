import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IntroComponent } from './components/intro/intro.component';
import { HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import {ProfileService} from './services/profile/profile.service';


@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    SvgIconComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
