import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { Hero } from '../../section/hero/hero';
import { Testimonial } from '../../testimonial/testimonial';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, Testimonial, Hero],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
