import { Resend } from 'resend';
import { env } from './env';
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
  private client = new Resend(env.RESEND_API_KEY);

  async send(input: SendEmailInput) {
    const result = await this.client.emails.send({
      from: env.RESEND_FROM_EMAIL,
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
    providerMessageId: messageId,
    status: 'sent'
  });
}
