import { z } from 'zod';
import { requireAdmin } from '@/lib/guards';
import { fail, ok } from '@/lib/http';
import { approveAndSendCredential, suspendCredential } from '@/server/provisioning';

const schema = z.object({ userId: z.string(), action: z.enum(['approve_send', 'suspend']) });

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Invalid payload');
  if (parsed.data.action === 'approve_send') {
    const credential = await approveAndSendCredential(parsed.data.userId, auth.session.userId);
    return ok({ credential });
  }
  const credential = await suspendCredential(parsed.data.userId, auth.session.userId);
  return ok({ credential });
}
