import 'server-only';
import { z } from 'zod';

function sanitizeEnvValue(value: string | undefined) {
  if (!value) return value;
  const trimmed = value.trim().replace(/^['\"]|['\"]$/g, '');
  return trimmed.endsWith('$') ? trimmed.slice(0, -1) : trimmed;
}

function readEnv(name: string, fallback?: string) {
  return sanitizeEnvValue(process.env[name] ?? (fallback ? process.env[fallback] : undefined));
}

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
  LEGAL_PLATFORM_URL: z.string().url(),
  ADMIN_OWNER_USERNAME: z.string().min(1).optional(),
  ADMIN_OWNER_PASSWORD: z.string().min(1).optional()
});

export const envServer = envServerSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: readEnv('APP_URL'),
  MONGODB_URI: readEnv('MONGODB_URI', 'MONGO_URI'),
  AUTH_SECRET: readEnv('AUTH_SECRET', 'JWT_SECRET'),
  STRIPE_SECRET_KEY: readEnv('STRIPE_SECRET_KEY'),
  STRIPE_PUBLISHABLE_KEY: readEnv('STRIPE_PUBLISHABLE_KEY'),
  STRIPE_WEBHOOK_SECRET: readEnv('STRIPE_WEBHOOK_SECRET'),
  STRIPE_PRICE_BASIC_MONTHLY: readEnv('STRIPE_PRICE_BASIC_MONTHLY', 'STRIPE_PRICE_ID'),
  STRIPE_PRICE_BASIC_ANNUAL: readEnv('STRIPE_PRICE_BASIC_ANNUAL', 'STRIPE_PRICE_ID'),
  STRIPE_PRICE_PRO_MONTHLY: readEnv('STRIPE_PRICE_PRO_MONTHLY', 'STRIPE_PRICE_ID'),
  STRIPE_PRICE_PRO_ANNUAL: readEnv('STRIPE_PRICE_PRO_ANNUAL', 'STRIPE_PRICE_ID'),
  RESEND_API_KEY: readEnv('RESEND_API_KEY'),
  RESEND_FROM_EMAIL: readEnv('RESEND_FROM_EMAIL'),
  SUPPORT_EMAIL: readEnv('SUPPORT_EMAIL'),
  SUPPORT_WHATSAPP_URL: readEnv('SUPPORT_WHATSAPP_URL'),
  LEGAL_PLATFORM_URL: readEnv('LEGAL_PLATFORM_URL'),
  ADMIN_OWNER_USERNAME: readEnv('ADMIN_OWNER_USERNAME'),
  ADMIN_OWNER_PASSWORD: readEnv('ADMIN_OWNER_PASSWORD')
});
export type EnvServer = z.infer<typeof envServerSchema>;

export function requireServerEnv(name: keyof EnvServer) {
  const value = envServer[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
