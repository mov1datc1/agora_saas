import Stripe from 'stripe';
import { env } from './env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const stripePriceMap = {
  basic_monthly: env.STRIPE_PRICE_BASIC_MONTHLY,
  basic_annual: env.STRIPE_PRICE_BASIC_ANNUAL,
  pro_monthly: env.STRIPE_PRICE_PRO_MONTHLY,
  pro_annual: env.STRIPE_PRICE_PRO_ANNUAL
};
