import { requireUser } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { Subscription } from '@/models/subscription';
import { AccessCredential } from '@/models/accessCredential';
import { ok, fail } from '@/lib/http';

export async function GET() {
  try {
    const auth = await requireUser();
    if ('response' in auth) return auth.response;
    await connectDb();
    const [user, subscription, credential] = await Promise.all([
      User.findById(auth.session.userId).select('-passwordHash -resetTokenHash -resetTokenExpiresAt'),
      Subscription.findOne({ userId: auth.session.userId }),
      AccessCredential.findOne({ userId: auth.session.userId })
    ]);
    return ok({ user, subscription, credential });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Cannot load profile', 500);
  }
}
