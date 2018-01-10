import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as Swiper from 'swiper';
import {BaseComponent} from '../../_base/base.component';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntroComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    const myswiper = new Swiper.default('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
    });
    console.log(this.getProfileService());
  }

}
