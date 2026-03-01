import { z } from 'zod';
import { setSession } from '@/lib/auth';
import { fail, ok } from '@/lib/http';
import { envServer } from '@/lib/env.server';
import { checkRateLimit } from '@/lib/rateLimit';

const schema = z.object({ username: z.string().min(1), password: z.string().min(1) });

const FALLBACK_OWNER_USERNAME = 'owner@agora.local';
const FALLBACK_OWNER_PASSWORD = 'AgoraOwner#2026';

export async function POST(req: Request) {
  if (!checkRateLimit(`admin-login:${req.headers.get('x-forwarded-for') ?? 'local'}`, 10)) {
    return fail('Too many attempts', 429);
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail('Credenciales inválidas', 400);

  const validUsername = envServer.ADMIN_OWNER_USERNAME || FALLBACK_OWNER_USERNAME;
  const validPassword = envServer.ADMIN_OWNER_PASSWORD || FALLBACK_OWNER_PASSWORD;

  if (parsed.data.username !== validUsername || parsed.data.password !== validPassword) {
    return fail('Usuario o contraseña incorrectos', 401);
  }

  await setSession('owner-admin', 'admin');
  return ok({ success: true });
}
