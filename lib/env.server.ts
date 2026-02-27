import 'server-only';
import { z } from 'zod';

const envServerSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url(),
  MONGODB_URI: z.string().min(1),
  AUTH_SECRET: z.string().min(12),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_BASIC_MONTHLY: z.string().min(1).optional(),
  STRIPE_PRICE_BASIC_ANNUAL: z.string().min(1).optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().min(1).optional(),
  STRIPE_PRICE_PRO_ANNUAL: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  SUPPORT_EMAIL: z.string().email(),
  SUPPORT_WHATSAPP_URL: z.string().url(),
  LEGAL_PLATFORM_URL: z.string().url()
});

export const envServer = envServerSchema.parse(process.env);
export type EnvServer = z.infer<typeof envServerSchema>;

export function requireServerEnv(name: keyof EnvServer) {
  const value = envServer[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
