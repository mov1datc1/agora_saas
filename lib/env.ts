import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url(),
  RESEND_FROM_EMAIL: z.string().email(),
  SUPPORT_EMAIL: z.string().email(),
  SUPPORT_WHATSAPP_URL: z.string().url(),
  LEGAL_PLATFORM_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
