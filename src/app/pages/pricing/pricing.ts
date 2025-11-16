import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PricingCard, PricingTier } from '../../section/pricing-card/pricing-card';
import { Footer } from '../../section/footer/footer';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PricingCard, Footer],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.scss'],
})
export class Pricing {
  discountCode = '';

  pricingTiers: PricingTier[] = [
    {
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
}
