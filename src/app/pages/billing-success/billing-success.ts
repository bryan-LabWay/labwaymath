import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-billing-success',
  standalone: true,
  templateUrl: './billing-success.html',
  styleUrl: './billing-success.scss',
})
export class BillingSuccess implements OnInit {
  sessionId = '';
  isLoading = true;
  isPaid = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id') ?? '';

    if (!this.sessionId) {
      // No session id → user manually navigated here
      this.router.navigate(['/pricing']);
      return;
    }

    this.verifyPayment();
  }

  verifyPayment() {
    this.http
      .get<{ paid: boolean }>('/api/verify-checkout', {
        params: { session_id: this.sessionId },
      })
      .subscribe({
        next: (res) => {
          this.isPaid = res.paid === true;
          this.isLoading = false;

          if (!this.isPaid) {
            // Payment not confirmed → send them back
            this.router.navigate(['/pricing']);
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMsg = 'Unable to verify payment.';
        },
      });
  }
}
