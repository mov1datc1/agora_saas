import Stripe from 'stripe';
import { requireServerEnv } from './env.server';

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(requireServerEnv('STRIPE_SECRET_KEY'));
  }
  return stripeClient;
}

export function getStripePriceMap() {
  return {
    basic_monthly: requireServerEnv('STRIPE_PRICE_BASIC_MONTHLY'),
    basic_annual: requireServerEnv('STRIPE_PRICE_BASIC_ANNUAL'),
    pro_monthly: requireServerEnv('STRIPE_PRICE_PRO_MONTHLY'),
    pro_annual: requireServerEnv('STRIPE_PRICE_PRO_ANNUAL')
  };
}
