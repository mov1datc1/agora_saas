import { AnalyticsSnapshot } from '@/models/analyticsSnapshot';
import { Subscription } from '@/models/subscription';
import { connectDb } from '@/lib/db';

export async function buildAnalyticsSnapshot() {
  await connectDb();
  const now = new Date();
  const activeSubs = await Subscription.countDocuments({ status: { $in: ['active', 'trialing', 'past_due'] } });
  const canceled = await Subscription.countDocuments({ status: 'canceled' });
  const trials = await Subscription.countDocuments({ status: 'trialing' });
  const mrrSubs = await Subscription.find({ status: { $in: ['active', 'trialing'] } }).select('planKey interval');
  const mrr = mrrSubs.reduce((acc, s) => {
    const unit = s.planKey === 'pro' ? 64 : 32;
    return acc + (s.interval === 'annual' ? unit * 0.8 : unit);
  }, 0);
  const snapshot = await AnalyticsSnapshot.findOneAndUpdate(
    { snapshotDate: new Date(now.toDateString()) },
    {
      snapshotDate: new Date(now.toDateString()),
      mrr,
      churnRate: activeSubs ? canceled / activeSubs : 0,
      newSubscriptions: activeSubs,
      cancellations: canceled,
      activeTrials: trials
    },
    { upsert: true, new: true }
  );
  return snapshot;
}
