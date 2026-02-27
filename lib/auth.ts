import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { envServer } from './env.server';

const SESSION_COOKIE = 'agora_session';

type SessionPayload = { userId: string; role: 'customer' | 'admin'; exp: number };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function createResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return { token, tokenHash: crypto.createHash('sha256').update(token).digest('hex') };
}

function sign(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', envServer.AUTH_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token: string): SessionPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', envServer.AUTH_SECRET).update(body).digest('base64url');
  if (sig !== expected) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
  if (payload.exp < Date.now()) return null;
  return payload;
}

export async function setSession(userId: string, role: 'customer' | 'admin') {
  const token = sign({ userId, role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: envServer.NODE_ENV === 'production',
    path: '/'
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verify(token);
}
