import { z } from 'zod';
import { requireAdmin } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { fail, ok } from '@/lib/http';
import { User } from '@/models/user';
import { Subscription } from '@/models/subscription';

const schema = z.object({
  userId: z.string().min(1),
  action: z.enum(['suspend', 'delete_user', 'update_subscription']),
  status: z.string().min(2).optional(),
  planKey: z.enum(['basic', 'pro']).optional(),
  interval: z.enum(['monthly', 'annual']).optional()
});

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return fail('Invalid payload');

    await connectDb();
    const { userId, action, status, planKey, interval } = parsed.data;

    if (action === 'delete_user') {
      const user = await User.findByIdAndUpdate(userId, { deletedAt: new Date() }, { new: true });
      if (!user) return fail('User not found', 404);
      return ok({ success: true, userId, action });
    }

    const subscription = await Subscription.findOne({ userId });
    if (!subscription) return fail('Subscription not found for user', 404);

    if (action === 'suspend') {
      subscription.status = 'suspended';
      subscription.suspendedAt = new Date();
      await subscription.save();
      return ok({ success: true, userId, action, subscription });
    }

    if (status) subscription.status = status;
    if (planKey) subscription.planKey = planKey;
    if (interval) subscription.interval = interval;
    if (subscription.status !== 'suspended') subscription.suspendedAt = null;
    await subscription.save();

    return ok({ success: true, userId, action, subscription });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Cannot execute admin action', 500);
  }
}
