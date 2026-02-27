import { processPaymentFailures } from '@/server/reminders';
import { buildAnalyticsSnapshot } from '@/server/analytics';
import { envServer } from '@/lib/env.server';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${envServer.AUTH_SECRET}`) return new Response('Unauthorized', { status: 401 });
  await processPaymentFailures();
  await buildAnalyticsSnapshot();
  return new Response('ok');
}
