import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IntroComponent } from './components/intro/intro.component';
import { HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';


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
  bootstrap: [AppComponent]
})
export class AppModule { }
