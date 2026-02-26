import { getSession } from './auth';
import { fail } from './http';

export async function requireUser() {
  const session = await getSession();
  if (!session) return { response: fail('Unauthorized', 401) };
  return { session };
}

export async function requireAdmin() {
  const result = await requireUser();
  if ('response' in result) return result;
  if (result.session.role !== 'admin') return { response: fail('Forbidden', 403) };
  return result;
}
