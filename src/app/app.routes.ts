import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Pricing } from './pages/pricing/pricing';
import { ContactUs } from './pages/contact-us/contact-us';
import { BillingSuccess } from './pages/billing-success/billing-success';
import { SignUp } from './pages/sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'pricing', component: Pricing },
  { path: 'contact', component: ContactUs },
  { path: 'billing/success', component: BillingSuccess },
  { path: 'sign-up', component: SignUp},
  { path: '**', redirectTo: '' },
];
