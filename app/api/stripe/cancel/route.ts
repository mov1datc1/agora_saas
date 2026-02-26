import { requireUser } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { Subscription } from '@/models/subscription';
import { stripe } from '@/lib/stripe';
import { ok, fail } from '@/lib/http';

export async function POST() {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  await connectDb();
  const sub = await Subscription.findOne({ userId: auth.session.userId });
  if (!sub?.stripeSubscriptionId) return fail('No active subscription', 404);
  await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
  sub.status = 'canceled';
  sub.canceledAt = new Date();
  await sub.save();
  return ok({ success: true });
}
