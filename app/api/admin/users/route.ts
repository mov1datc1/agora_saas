import { requireAdmin } from '@/lib/guards';
import { connectDb } from '@/lib/db';
import { User } from '@/models/user';
import { ok, fail } from '@/lib/http';

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if ('response' in auth) return auth.response;
    await connectDb();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const role = searchParams.get('role');
    const users = await User.find({
      ...(q ? { email: { $regex: q, $options: 'i' } } : {}),
      ...(role ? { role } : {})
    }).select('-passwordHash').limit(100);
    return ok({ users });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Cannot list users', 500);
  }
}
