import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../billing.service';
import { HttpClient } from '@angular/common/http';
import { RecaptchaModule } from 'ng-recaptcha-2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
})
export class SignUp {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private billing = inject(BillingService);
  private http = inject(HttpClient);
  siteKey = environment.recaptchaSiteKey;

  isPaying = false;
  errorMsg = '';
  recaptchaToken = '';

  // comes from Pricing page
  priceId = '';

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    phone: ['', [Validators.required, Validators.maxLength(30)]],
  });

  ngOnInit() {
    this.priceId = this.route.snapshot.queryParamMap.get('priceId') ?? '';

    // If someone visits /sign-up directly without selecting a plan
    if (!this.priceId) {
      this.errorMsg = 'No plan selected. Please go back to Pricing and select a plan.';
    }
  }

  hasError(controlName: 'fullName' | 'email' | 'phone', error: string) {
    const c = this.form.get(controlName);
    return !!c && c.touched && c.hasError(error);
  }

  async onPayNow() {
  this.errorMsg = '';

  if (!this.priceId) return;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  if (!this.recaptchaToken) {
    this.errorMsg = 'Please complete the reCAPTCHA.';
    return;
  }

  this.isPaying = true;

  try {
    // 1) Capture lead first (email us)
    await this.http
      .post('/api/signup-lead', {
        fullName: this.form.getRawValue().fullName,
        email: this.form.getRawValue().email,
        phone: this.form.getRawValue().phone,
        recaptchaToken: this.recaptchaToken,
        website: '', // honeypot support
      })
      .toPromise();

    // 2) Proceed to Stripe checkout
    const url = await this.billing.createCheckoutSession(this.priceId);
    window.location.href = url;
  } catch (e: any) {
    this.errorMsg =
      e?.error?.message ||
      e?.error?.error?.message ||
      e?.message ||
      'Failed to continue. Please try again.';
    this.isPaying = false;
  }
}


  goBackToPricing() {
    this.router.navigateByUrl('/pricing');
  }

  onRecaptchaResolved(token: string | null) {
    this.recaptchaToken = token ?? '';
  }
}
