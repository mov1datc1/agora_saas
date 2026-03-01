import { requireAdmin } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { Subscription } from '@/models/subscription';
import { AccessCredential } from '@/models/accessCredential';
import { ok, fail } from '@/lib/http';

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;
    await connectDb();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const role = searchParams.get('role');

    const users = await User.find({
      ...(q ? { email: { $regex: q, $options: 'i' } } : {}),
      ...(role ? { role } : {}),
      deletedAt: null
    }).select('-passwordHash').sort({ createdAt: -1 }).limit(100);

    const userIds = users.map((u) => u._id);
    const [subscriptions, credentials, totalUsers, activeSubscriptions, suspendedSubscriptions] = await Promise.all([
      Subscription.find({ userId: { $in: userIds } }).sort({ updatedAt: -1 }),
      AccessCredential.find({ userId: { $in: userIds } }),
      User.countDocuments({ deletedAt: null }),
      Subscription.countDocuments({ status: { $in: ['active', 'trialing'] } }),
      Subscription.countDocuments({ status: 'suspended' })
    ]);

    const subByUser = new Map(subscriptions.map((sub) => [String(sub.userId), sub]));
    const credByUser = new Map(credentials.map((cred) => [String(cred.userId), cred]));

    const enrichedUsers = users.map((user) => {
      const sub = subByUser.get(String(user._id));
      const cred = credByUser.get(String(user._id));
      return {
        ...user.toObject(),
        subscription: sub
          ? {
              planKey: sub.planKey,
              interval: sub.interval,
              status: sub.status,
              currentPeriodEnd: sub.currentPeriodEnd,
              suspendedAt: sub.suspendedAt
            }
          : null,
        credential: cred
          ? {
              status: cred.status,
              username: cred.username
            }
          : null
      };
    });

    const metrics = {
      totalUsers,
      listedUsers: enrichedUsers.length,
      activeSubscriptions,
      suspendedSubscriptions,
      noSubscriptionUsers: Math.max(totalUsers - (activeSubscriptions + suspendedSubscriptions), 0)
    };

    return ok({ users: enrichedUsers, metrics });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Cannot list users', 500);
  }
}
