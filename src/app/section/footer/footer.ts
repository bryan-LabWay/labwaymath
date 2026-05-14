import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly viewportScroller = inject(ViewportScroller);

  scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
