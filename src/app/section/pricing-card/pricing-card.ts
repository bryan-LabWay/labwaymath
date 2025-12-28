import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PricingFeature {
  label: string;
  subItems?: string[];
}

export interface PricingTier {
  priceId: string
  name: string;
  price: number;
  recommended?: boolean;
  featuresTitle: string;
  features: PricingFeature[];
}

@Component({
  selector: 'app-pricing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-card.html',
  styleUrls: ['./pricing-card.scss'],
})
export class PricingCard {
  @Input() tier!: PricingTier;
}
