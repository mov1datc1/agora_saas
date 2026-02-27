import { requireUser } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { Subscription } from '@/models/subscription';
import { User } from '@/models/user';
import { getStripe, getStripePriceMap } from '@/lib/stripe';
import { ok, fail } from '@/lib/http';
import { envServer } from '@/lib/env.server';

export async function POST() {
  try {
    const auth = await requireUser();
    if ('response' in auth) return auth.response;
    await connectDb();
    const stripe = getStripe();
    const sub = await Subscription.findOne({ userId: auth.session.userId });
    let customerId = sub?.stripeCustomerId || null;

    if (!customerId) {
      const user = await User.findById(auth.session.userId).select('email name');
      if (user?.email) {
        const customers = await stripe.customers.list({ email: user.email, limit: 10 });
        const customer = customers.data.find((c) => !c.deleted);
        customerId = customer?.id || null;

        if (customerId) {
          const stripeSubList = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 1 });
          const stripeSub = stripeSubList.data[0];
          if (stripeSub) {
            const prices = getStripePriceMap();
            const priceMap: Record<string, { planKey: 'basic' | 'pro'; interval: 'monthly' | 'annual' }> = {
              [prices.basic_monthly]: { planKey: 'basic', interval: 'monthly' },
              [prices.basic_annual]: { planKey: 'basic', interval: 'annual' },
              [prices.pro_monthly]: { planKey: 'pro', interval: 'monthly' },
              [prices.pro_annual]: { planKey: 'pro', interval: 'annual' }
            };
            const priceId = stripeSub.items.data[0]?.price?.id;
            const mappedPrice = priceId ? priceMap[priceId] : null;

            if (mappedPrice) {
              await Subscription.findOneAndUpdate(
                { userId: auth.session.userId },
                {
                  userId: auth.session.userId,
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: stripeSub.id,
                  planKey: mappedPrice.planKey,
                  interval: mappedPrice.interval,
                  status: stripeSub.status,
                  currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                  trialEndsAt: stripeSub.trial_end ? new Date(stripeSub.trial_end * 1000) : null
                },
                { upsert: true, new: true }
              );
            }
          }
        }

        if (!customerId) {
          const newCustomer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: { userId: String(auth.session.userId) }
          });
          customerId = newCustomer.id;
        }
      }
    }

    if (!customerId) return fail('No billing profile', 404);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${envServer.APP_URL}/dashboard/billing`
    });
    return ok({ url: session.url });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Portal failed', 500);
  }
}
