import Stripe from 'stripe';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { envServer } from '@/lib/env.server';
import { connectDb } from '@/lib/db';
import { Subscription } from '@/models/subscription';
import { Invoice } from '@/models/invoice';
import { ensureCredentialDraft, suspendCredential } from '@/server/provisioning';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, envServer.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  await connectDb();

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: String(s.subscription) },
        {
          userId: s.metadata?.userId,
          stripeCustomerId: String(s.customer),
          stripeSubscriptionId: String(s.subscription),
          planKey: s.metadata?.plan,
          interval: s.metadata?.interval,
          status: 'trialing'
        },
        { upsert: true, new: true }
      );
      if (s.metadata?.userId) await ensureCredentialDraft(s.metadata.userId);
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          stripeCustomerId: String(sub.customer),
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null
        }
      );
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const dbSub = await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        { status: 'canceled', canceledAt: new Date() },
        { new: true }
      );
      if (dbSub) await suspendCredential(String(dbSub.userId));
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await Subscription.findOneAndUpdate({ stripeCustomerId: String(invoice.customer) }, { status: 'past_due' });
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = await Subscription.findOne({ stripeCustomerId: String(invoice.customer) });
      if (!sub) break;
      await Invoice.findOneAndUpdate(
        { stripeInvoiceId: invoice.id },
        {
          userId: sub.userId,
          stripeInvoiceId: invoice.id,
          amountDue: invoice.amount_due,
          amountPaid: invoice.amount_paid,
          currency: invoice.currency,
          status: invoice.status,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          invoicePdf: invoice.invoice_pdf,
          paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : null,
          periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
          periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null
        },
        { upsert: true }
      );
      await Subscription.findOneAndUpdate({ stripeCustomerId: String(invoice.customer) }, { status: 'active', reminderCount: 0 });
      break;
    }
  }

  return new Response('ok');
}
