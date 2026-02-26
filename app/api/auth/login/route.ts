import { z } from 'zod';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { comparePassword, setSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { fail, ok } from '@/lib/http';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  if (!checkRateLimit(`login:${req.headers.get('x-forwarded-for') ?? 'local'}`, 10)) return fail('Too many attempts', 429);
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Invalid input');
  await connectDb();
  const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (!user) return fail('Invalid credentials', 401);
  const isValid = await comparePassword(parsed.data.password, user.passwordHash);
  if (!isValid) return fail('Invalid credentials', 401);
  await setSession(String(user._id), user.role);
  return ok({ success: true });
}
