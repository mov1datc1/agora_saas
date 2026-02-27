import { z } from 'zod';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { Organization } from '@/models/organization';
import { checkRateLimit } from '@/lib/rateLimit';
import { fail, ok } from '@/lib/http';
import { hashPassword, setSession } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  name: z.string().min(2),
  organizationType: z.enum(['independent_lawyer', 'firm']).default('independent_lawyer'),
  organizationName: z.string().min(2)
});

export async function POST(req: Request) {
  try {
    if (!checkRateLimit(`signup:${req.headers.get('x-forwarded-for') ?? 'local'}`, 5)) return fail('Too many attempts', 429);
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return fail('Invalid input');
    await connectDb();
    const exists = await User.findOne({ email: parsed.data.email.toLowerCase() });
    if (exists) return fail('Email already exists', 409);
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await User.create({ email: parsed.data.email, name: parsed.data.name, passwordHash });
    const org = await Organization.create({ type: parsed.data.organizationType, legalName: parsed.data.organizationName, ownerUserId: user._id });
    user.organizationId = org._id;
    await user.save();
    await setSession(String(user._id), user.role);
    return ok({ userId: user._id }, 201);
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Signup failed', 500);
  }
}
