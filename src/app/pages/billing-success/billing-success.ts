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
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
  // Listen for query params (more reliable than snapshot in some setups)
  this.route.queryParamMap.subscribe((params) => {
    const fromRouter = params.get('session_id') ?? '';

    // Fallback: read directly from the browser URL (bulletproof)
    const fromWindow =
      new URLSearchParams(window.location.search).get('session_id') ?? '';

    this.sessionId = fromRouter || fromWindow;

    console.log('[BillingSuccess] fromRouter:', fromRouter);
    console.log('[BillingSuccess] fromWindow:', fromWindow);
    console.log('[BillingSuccess] final sessionId:', this.sessionId);

    if (!this.sessionId) {
      // IMPORTANT: do NOT redirect immediately while debugging
      // This is what’s currently hiding the real problem.
      // this.router.navigate(['/pricing']);
      return;
    }

    this.verifyPayment();
  });
}

  verifyPayment() {
    this.isLoading = true;
    this.errorMsg = '';

    // adjust path if your verify endpoint differs
    this.http
      .get<{ paid: boolean; status?: string; message?: string }>(
        `/api/verify-checkout?session_id=${encodeURIComponent(this.sessionId)}`
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;

          if (!res?.paid) {
            // DO NOT auto-redirect. Show message instead.
            this.errorMsg =
              res?.message ||
              `We couldn't verify your payment yet (status: ${res?.status ?? 'unknown'}). Please refresh in a few seconds.`;
          }
        },
        error: () => {
          this.isLoading = false;
          // DO NOT auto-redirect. Show message instead.
          this.errorMsg =
            "We couldn't verify your payment right now. Please refresh in a few seconds.";
        },
      });
  }
}
