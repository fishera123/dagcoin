import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer } from '@angular/core';
import { HttpClient, Response } from '@angular/common/http';

@Component({
  selector: 'app-svg-icon',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent {
  @Input()
  set name(val: string) {
    this.loadSvg(val);
  }

  @Input() alt: string;

  constructor(private http: HttpClient, private renderer: Renderer, private elementRef: ElementRef) { }

  loadSvg(val: string) {
    debugger;

    this.http.get(`assets/svgs/${val}.svg`)
      .subscribe(
        res => {
          const element = this.elementRef.nativeElement;
          element.innerHTML = '';
          const response = res.text();
          const parser = new DOMParser();
          const svg = parser.parseFromString(response, 'image/svg+xml');
          this.renderer.projectNodes(element, [svg.documentElement]);
        },
        err => { console.error(err); });
  }

}
