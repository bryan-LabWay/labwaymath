import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha-2';

type ContactResponse = { ok?: boolean; message?: string };

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RecaptchaModule, 
    RecaptchaFormsModule
  ],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss',
})
export class ContactUs {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  isSubmitting = false;
  successMsg = '';
  errorMsg = '';

  // If your API is on the SAME domain as the Angular site, keep this:
  private readonly apiUrl = '/api/contact';

  // If your Angular app is on a different domain, use the full URL instead:
  // private readonly apiUrl = 'https://labwaymath.vercel.app/api/contact';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
    website: [''], // honeypot (should stay empty)
    recaptchaToken: ['', [Validators.required]],
  });

  onCaptchaResolved(token: string | null) {
    this.form.controls.recaptchaToken.setValue(token ?? '');
    this.form.controls.recaptchaToken.markAsTouched();
  }

  onCaptchaExpired() {
    this.form.controls.recaptchaToken.setValue('');
    this.form.controls.recaptchaToken.markAsTouched();
  }

  onSubmit() {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.http
      .post<ContactResponse>(this.apiUrl, this.form.getRawValue(), {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (resp) => {
          // Anything not 200 -> show error
          if (resp.status !== 200) {
            this.errorMsg = resp.body?.message || 'Failed to send message. Please try again.';
            return;
          }

          // Your API uses { ok: true }
          if (resp.body?.ok) {
            this.successMsg = 'Message sent! We’ll get back to you soon.';
            this.form.reset({ name: '', email: '', message: '', website: '' });
          } else {
            this.errorMsg = resp.body?.message || 'Something went wrong. Please try again.';
          }
        },
        error: (err) => {
          // Non-200 (or network errors) land here too
          this.errorMsg =
            this.errorMsg = this.extractErrorMessage(err);
        },
      });
  }


  // optional helpers for template
  hasError(controlName: 'name' | 'email' | 'message', error: string) {
    const c = this.form.get(controlName);
    return !!c && c.touched && c.hasError(error);
  }

  private extractErrorMessage(err: any): string {
    // Common case: backend returns JSON { message: "..." }
    const msgFromObj = err?.error?.message;
    if (typeof msgFromObj === 'string' && msgFromObj.trim()) return msgFromObj;

    // Sometimes err.error is a plain string
    if (typeof err?.error === 'string' && err.error.trim()) {
      // try parsing JSON string
      try {
        const parsed = JSON.parse(err.error);
        if (parsed?.message) return parsed.message;
      } catch {
        return err.error;
      }
    }

    // Fallbacks
    if (typeof err?.message === 'string' && err.message.trim()) return err.message;
    if (typeof err?.status === 'number') return `Request failed (${err.status}). Please try again.`;

    return 'Something went wrong. Please try again.';
  }
}
