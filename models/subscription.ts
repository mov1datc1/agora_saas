import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stripeCustomerId: { type: String, unique: true, sparse: true, index: true },
    stripeSubscriptionId: { type: String, unique: true, sparse: true, index: true },
    planKey: { type: String, enum: ['basic', 'pro'], required: true, index: true },
    interval: { type: String, enum: ['monthly', 'annual'], required: true },
    status: { type: String, required: true, index: true },
    trialEndsAt: { type: Date, index: true },
    currentPeriodEnd: { type: Date, index: true },
    canceledAt: Date,
    suspendedAt: Date,
    reminderCount: { type: Number, default: 0 },
    lastReminderAt: Date
  },
  baseOptions
);
subscriptionSchema.index({ status: 1, updatedAt: -1 });
withUpdatedAtIndex(subscriptionSchema);

export const Subscription = models.Subscription || model('Subscription', subscriptionSchema);
