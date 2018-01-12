import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroComponent } from './intro.component';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {Utils} from '../../_base/utils';
import {AppComponent} from '../../app.component';
import {CommonTestModuleMetadata} from '../../_test/common.test.module.metadata';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(Utils.merge(
      {declarations: [IntroComponent, SvgIconComponent ]}, CommonTestModuleMetadata.createTestModuleMetadata()
    )).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
