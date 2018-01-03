import {Component, Input, ChangeDetectionStrategy, ElementRef, Renderer, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-svg-icon',
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent implements OnInit {
  @Input() name;
  @Input() className;

  constructor(private http: HttpClient, private renderer: Renderer, private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.loadSvg(this.name, this.className);
  }

  loadSvg(name: string, className: string) {

    this.http.get(`/assets/svgs/${name}.svg`, {responseType: 'text'})
      .subscribe(
        res => {
          const element = this.elementRef.nativeElement;
          const parser = new DOMParser();
          const svg = parser.parseFromString(res, 'image/svg+xml').documentElement;
          if (className) {
            this.renderer.setElementClass(svg, className, true);
          }
          this.renderer.projectNodes(element, [svg]);
        });
  }
}
