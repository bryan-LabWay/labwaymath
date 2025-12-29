import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

type VerifyResponse = {
  paid: boolean;
  payment_status?: string;
  status?: string;
  amount_total?: number;
  currency?: string;
};

@Component({
  selector: 'app-billing-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './billing-success.html',
  styleUrl: './billing-success.scss',
})
export class BillingSuccess {
  sessionId = '';

  isLoading = true;
  paid = false;
  errorMsg = '';
  verifyData?: VerifyResponse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const fromRouter = params.get('session_id') ?? '';
      const fromWindow =
        new URLSearchParams(window.location.search).get('session_id') ?? '';

      this.sessionId = fromRouter || fromWindow;

      if (!this.sessionId) {
        this.router.navigate(['/pricing']);
        return;
      }

      this.verifyPayment();
      console.log('calling verifyPayment with sessionId', this.sessionId);
    });
  }

  verifyPayment() {
    this.isLoading = true;
    this.errorMsg = '';
    this.paid = false;

    this.http
      .get<VerifyResponse>(
        `/api/verify-checkout?session_id=${encodeURIComponent(this.sessionId)}`
      )
      .subscribe({
        next: (res) => {
          console.log('verify response', res);
          this.verifyData = res;
          this.paid = !!res?.paid;
          this.isLoading = false; // ✅ THIS is what unblocks the UI
        },
        error: (err) => {
          this.isLoading = false; // ✅ also unblock on error
          this.errorMsg =
            err?.error?.message ||
            'We could not verify your payment right now. Please try again.';
        },
      });
  }
}
