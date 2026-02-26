import { z } from 'zod';
import { requireUser } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { comparePassword, hashPassword } from '@/lib/auth';
import { fail, ok } from '@/lib/http';

const schema = z.object({ currentPassword: z.string(), newPassword: z.string().min(10) });

export async function POST(req: Request) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Invalid payload');
  await connectDb();
  const user = await User.findById(auth.session.userId);
  if (!user) return fail('Not found', 404);
  const valid = await comparePassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return fail('Current password incorrect', 401);
  user.passwordHash = await hashPassword(parsed.data.newPassword);
  await user.save();
  return ok({ success: true });
}
