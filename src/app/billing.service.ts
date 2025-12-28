import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BillingService {
  constructor(private http: HttpClient) {}

  async createCheckoutSession(priceId: string): Promise<string> {
    const resp = await firstValueFrom(
      this.http.post<{ url: string }>('/api/create-checkout-session', { priceId })
    );
    if (!resp?.url) throw new Error('No checkout url returned by server.');
    return resp.url;
  }
}
