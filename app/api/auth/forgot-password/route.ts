import { z } from 'zod';
import crypto from 'crypto';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { createResetToken } from '@/lib/auth';
import { sendTransactionalEmail } from '@/lib/email';
import { fail, ok } from '@/lib/http';

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Invalid email');
  await connectDb();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user) return ok({ success: true });
  const { token, tokenHash } = createResetToken();
  user.resetTokenHash = tokenHash;
  user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();
  const url = `${process.env.APP_URL}/reset-password?token=${token}`;
  await sendTransactionalEmail({
    to: user.email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${url}">here</a> to reset password.</p>`,
    userId: String(user._id),
    type: 'forgot_password'
  });
  return ok({ success: true });
}

export const runtime = 'nodejs';
