import { requireUser } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { Subscription } from '@/models/subscription';
import { AccessCredential } from '@/models/accessCredential';
import { ok } from '@/lib/http';

export async function GET() {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  await connectDb();
  const [user, subscription, credential] = await Promise.all([
    User.findById(auth.session.userId).select('-passwordHash -resetTokenHash -resetTokenExpiresAt'),
    Subscription.findOne({ userId: auth.session.userId }),
    AccessCredential.findOne({ userId: auth.session.userId })
  ]);
  return ok({ user, subscription, credential });
}
