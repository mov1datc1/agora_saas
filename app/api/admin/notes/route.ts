import { z } from 'zod';
import { requireAdmin } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { AdminNote } from '@/models/adminNote';
import { fail, ok } from '@/lib/http';

const schema = z.object({ userId: z.string(), body: z.string().min(2) });

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Invalid payload');
  await connectDb();
  const note = await AdminNote.create({ userId: parsed.data.userId, body: parsed.data.body, adminUserId: auth.session.userId });
  return ok({ note }, 201);
}
