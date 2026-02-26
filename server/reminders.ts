import { connectDb } from '@/lib/db';
import { Subscription } from '@/models/subscription';
import { User } from '@/models/user';
import { sendTransactionalEmail } from '@/lib/email';
import { paymentReminderTemplate } from '@/emails/templates';
import { suspendCredential } from './provisioning';

export function shouldSendReminder(lastReminderAt: Date | null, now = new Date()) {
  if (!lastReminderAt) return true;
  return now.getTime() - lastReminderAt.getTime() >= 24 * 60 * 60 * 1000;
}

export async function processPaymentFailures() {
  await connectDb();
  const pastDueSubs = await Subscription.find({ status: 'past_due' });
  for (const sub of pastDueSubs) {
    const user = await User.findById(sub.userId);
    if (!user) continue;
    if (sub.reminderCount < 4 && shouldSendReminder(sub.lastReminderAt ?? null)) {
      const msg = paymentReminderTemplate(user.name, sub.reminderCount + 1);
      await sendTransactionalEmail({ to: user.email, subject: msg.subject, html: msg.html, userId: String(user._id), type: 'payment_failed_reminder' });
      sub.reminderCount += 1;
      sub.lastReminderAt = new Date();
      await sub.save();
      continue;
    }
    if (sub.reminderCount >= 4 && shouldSendReminder(sub.lastReminderAt ?? null)) {
      sub.status = 'suspended';
      sub.suspendedAt = new Date();
      await sub.save();
      await suspendCredential(String(sub.userId));
    }
  }
}
