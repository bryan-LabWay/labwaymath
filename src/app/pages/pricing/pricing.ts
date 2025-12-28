import { BillingService } from '../../billing.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingCard, PricingTier } from '../../section/pricing-card/pricing-card';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PricingCard],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.scss'],
})
export class Pricing {
  discountCode = '';

  isCheckingOut = false;
  checkoutError = '';

  pricingTiers: PricingTier[] = [
    {
      priceId: environment.priceAsyncTraining,
      name: 'Asynchronous Training',
      price: 199,
      recommended: false,
      featuresTitle: `What's Included`,
      features: [
        { label: 'The UCL Library' },
        {
          label: 'How to Videos',
          subItems: [
            'Logic before Procedure',
            'Applied Socratic Method',
            'The Conversation Algorithm',
          ],
        },
      ],
    },
    {
      priceId: environment.priceSmallGroupTraining,
      name: 'Small Group Training',
      price: 899,
      recommended: true,
      featuresTitle: `What's Included`,
      features: [
        { label: 'The UCL Library' },
        { label: '24 hours of live training' },
        { label: 'How to Videos' },
        { label: 'Post training implementation support' },
      ],
    },
  ];

  selectedPriceId = this.pricingTiers[1].priceId;

  selectPlan(tier: PricingTier) {
    this.selectedPriceId = tier.priceId;
  }

  trackByTierCode(_index: number, plan: PricingTier) {
    return plan.priceId;
  }

  constructor(private billing: BillingService) {}

  async checkoutSelected() {
    this.isCheckingOut = true;
    this.checkoutError = '';

    try {
      const url = await this.billing.createCheckoutSession(this.selectedPriceId);
      window.location.href = url;
    } catch (e: any) {
      this.checkoutError =
        e?.error?.message ||
        e?.error?.error?.message ||
        e?.message ||
        'Failed to start checkout.';
      this.isCheckingOut = false;
    }
  }
}
