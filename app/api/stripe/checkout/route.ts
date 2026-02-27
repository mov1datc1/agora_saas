import { z } from 'zod';
import { requireUser } from '@/lib/guards';
import { fail, ok } from '@/lib/http';
import { stripe, stripePriceMap } from '@/lib/stripe';
import { env } from '@/lib/env';

const schema = z.object({ plan: z.enum(['basic', 'pro']), interval: z.enum(['monthly', 'annual']) });

export async function POST(req: Request) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Invalid payload');
  const key = `${parsed.data.plan}_${parsed.data.interval}` as keyof typeof stripePriceMap;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: stripePriceMap[key], quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${env.APP_URL}/dashboard/billing?checkout=success`,
    cancel_url: `${env.APP_URL}/dashboard/billing?checkout=cancelled`,
    metadata: { userId: auth.session.userId, plan: parsed.data.plan, interval: parsed.data.interval }
  });
  return ok({ url: session.url });
}
