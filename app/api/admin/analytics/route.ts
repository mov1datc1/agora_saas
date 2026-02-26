import { requireAdmin } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { AnalyticsSnapshot } from '@/models/analyticsSnapshot';
import { ok } from '@/lib/http';

export async function GET() {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;
  await connectDb();
  const snapshots = await AnalyticsSnapshot.find().sort({ snapshotDate: -1 }).limit(30);
  return ok({ snapshots });
}
