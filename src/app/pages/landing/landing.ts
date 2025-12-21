import { Component } from '@angular/core';
import { Hero } from '../../section/hero/hero';
import { Testimonial } from '../../section/testimonial/testimonial';
import { HowItWorks } from '../../section/how-it-works/how-it-works';
import { CurrentCurriculums } from '../../section/current-curriculums/current-curriculums';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Testimonial, Hero, HowItWorks, CurrentCurriculums],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {  
  constructor(private viewportScroller: ViewportScroller) {}

  scrollToHowItWorks(): void {
    this.viewportScroller.scrollToAnchor('how-it-works');
  }
}
