import { z } from 'zod';
import crypto from 'crypto';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { hashPassword } from '@/lib/auth';
import { fail, ok } from '@/lib/http';

const schema = z.object({ token: z.string().min(10), password: z.string().min(10) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Invalid payload');
  await connectDb();
  const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest('hex');
  const user = await User.findOne({ resetTokenHash: tokenHash, resetTokenExpiresAt: { $gt: new Date() } });
  if (!user) return fail('Token invalid or expired', 400);
  user.passwordHash = await hashPassword(parsed.data.password);
  user.resetTokenHash = undefined;
  user.resetTokenExpiresAt = undefined;
  await user.save();
  return ok({ success: true });
}
