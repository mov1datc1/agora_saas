import { requireUser } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { Subscription } from '@/models/subscription';
import { getStripe } from '@/lib/stripe';
import { ok, fail } from '@/lib/http';
import { envServer } from '@/lib/env.server';

export async function POST() {
  try {
    const auth = await requireUser();
    if ('response' in auth) return auth.response;
    await connectDb();
    const sub = await Subscription.findOne({ userId: auth.session.userId });
    if (!sub?.stripeCustomerId) return fail('No billing profile', 404);
    const session = await getStripe().billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${envServer.APP_URL}/dashboard/billing`
    });
    return ok({ url: session.url });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Portal failed', 500);
  }
}
