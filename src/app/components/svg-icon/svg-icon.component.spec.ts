import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgIconComponent } from './svg-icon.component';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {CommonTestModuleMetadata} from '../../_test/common.test.module.metadata';

describe('SvgIconComponent', () => {
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient, HttpHandler],
      declarations: [ SvgIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;

    /*
    spyOn(component, 'loadSvg').and.callFake(() => {
      console.log('loadSvg called fake');
    });
    */

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
