import Stripe from 'stripe';
import { envServer } from './env.server';

export const stripe = new Stripe(envServer.STRIPE_SECRET_KEY);

export const stripePriceMap = {
  basic_monthly: envServer.STRIPE_PRICE_BASIC_MONTHLY,
  basic_annual: envServer.STRIPE_PRICE_BASIC_ANNUAL,
  pro_monthly: envServer.STRIPE_PRICE_PRO_MONTHLY,
  pro_annual: envServer.STRIPE_PRICE_PRO_ANNUAL
};
