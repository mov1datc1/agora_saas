import { connectDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { User } from '@/models/user';

async function run() {
  await connectDb();
  const email = process.env.ADMIN_EMAIL || 'admin@agora.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const exists = await User.findOne({ email });
  if (exists) return console.log('Admin exists');
  await User.create({ email, name: 'Admin', passwordHash: await hashPassword(password), role: 'admin' });
  console.log('Admin created');
}

run().then(() => process.exit(0));
