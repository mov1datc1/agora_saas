import crypto from 'crypto';
import { AccessCredential } from '@/models/accessCredential';
import { AccessEvent } from '@/models/accessEvent';
import { User } from '@/models/user';
import { connectDb } from '@/lib/db';
import { env } from '@/lib/env';
import { sendTransactionalEmail } from '@/lib/email';
import { credentialApprovedTemplate, suspensionTemplate } from '@/emails/templates';

export async function ensureCredentialDraft(userId: string) {
  await connectDb();
  const existing = await AccessCredential.findOne({ userId });
  if (existing) return existing;
  const username = `agora-${crypto.randomBytes(4).toString('hex')}`;
  const temporaryPassword = crypto.randomBytes(8).toString('hex');
  return AccessCredential.create({ userId, username, temporaryPassword, status: 'draft' });
}

export async function approveAndSendCredential(userId: string, adminUserId: string) {
  await connectDb();
  const credential = await AccessCredential.findOneAndUpdate(
    { userId },
    { status: 'sent', approvedBy: adminUserId, approvedAt: new Date(), sentAt: new Date() },
    { new: true }
  );
  const user = await User.findById(userId);
  if (!credential || !user) return null;
  const msg = credentialApprovedTemplate(user.name, credential.username, credential.temporaryPassword, env.LEGAL_PLATFORM_URL);
  await sendTransactionalEmail({ to: user.email, subject: msg.subject, html: msg.html, userId, type: 'credential_approved' });
  await AccessEvent.create({ userId, credentialId: credential._id, eventType: 'credential_sent', actorUserId: adminUserId });
  return credential;
}

export async function suspendCredential(userId: string, actorUserId?: string) {
  await connectDb();
  const credential = await AccessCredential.findOneAndUpdate({ userId }, { status: 'suspended', suspendedAt: new Date() }, { new: true });
  const user = await User.findById(userId);
  if (credential && user) {
    const msg = suspensionTemplate(user.name);
    await sendTransactionalEmail({ to: user.email, subject: msg.subject, html: msg.html, userId, type: 'access_suspended' });
    await AccessEvent.create({ userId, credentialId: credential._id, eventType: 'access_suspended', actorUserId });
  }
  return credential;
}
