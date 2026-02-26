import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url(),
  MONGODB_URI: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_BASIC_MONTHLY: z.string().min(1),
  STRIPE_PRICE_BASIC_ANNUAL: z.string().min(1),
  STRIPE_PRICE_PRO_MONTHLY: z.string().min(1),
  STRIPE_PRICE_PRO_ANNUAL: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  SUPPORT_EMAIL: z.string().email(),
  SUPPORT_WHATSAPP_URL: z.string().url(),
  LEGAL_PLATFORM_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
