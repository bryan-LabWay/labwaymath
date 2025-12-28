import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-billing-success',
  standalone: true,
  imports: [],
  templateUrl: './billing-success.html',
  styleUrl: './billing-success.scss',
})
export class BillingSuccess {
  sessionId = '';
  constructor(route: ActivatedRoute) {
    this.sessionId = route.snapshot.queryParamMap.get('session_id') ?? '';
  }
}
