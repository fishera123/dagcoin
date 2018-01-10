import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Swiper from 'swiper';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntroComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    const myswiper = new Swiper.default('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
    });
  }

}
