import { Resend } from 'resend';
import { envServer, requireServerEnv } from './env.server';
import { EmailEvent } from '@/models/emailEvent';
import { connectDb } from './db';

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  type: string;
};

export interface EmailProvider {
  send(input: SendEmailInput): Promise<string | undefined>;
}

class ResendProvider implements EmailProvider {
  async send(input: SendEmailInput) {
    const client = new Resend(requireServerEnv('RESEND_API_KEY'));
    const result = await client.emails.send({
      from: requireServerEnv('RESEND_FROM_EMAIL'),
      to: input.to,
      subject: input.subject,
      html: input.html
    });
    return result.data?.id;
  }
}

export const emailProvider: EmailProvider = new ResendProvider();

export async function sendTransactionalEmail(input: SendEmailInput) {
  const messageId = await emailProvider.send(input);
  await connectDb();
  await EmailEvent.create({
    userId: input.userId,
    type: input.type,
    recipient: input.to,
    provider: envServer.RESEND_API_KEY ? 'resend' : 'resend',
    providerMessageId: messageId,
    status: 'sent'
  });
}
