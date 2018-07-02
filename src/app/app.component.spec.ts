import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {CommonTestModuleMetadata} from './_test/common.test.module.metadata';
import {Utils} from './_base/utils';
import {IntroComponent} from './components/intro/intro.component';
import {SvgIconComponent} from './components/svg-icon/svg-icon.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule(Utils.merge(
      {declarations: [AppComponent, IntroComponent, SvgIconComponent]}, CommonTestModuleMetadata.createTestModuleMetadata()
    )).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));
  it('should render app-intro', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.intro_content.content')).toBeTruthy();
  }));
});
