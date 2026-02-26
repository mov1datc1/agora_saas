import { processPaymentFailures } from '@/server/reminders';
import { buildAnalyticsSnapshot } from '@/server/analytics';
import { env } from '@/lib/env';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${env.AUTH_SECRET}`) return new Response('Unauthorized', { status: 401 });
  await processPaymentFailures();
  await buildAnalyticsSnapshot();
  return new Response('ok');
}
