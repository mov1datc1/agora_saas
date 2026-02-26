import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const emailEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true, index: true },
    recipient: { type: String, required: true, index: true },
    provider: { type: String, enum: ['resend', 'sendgrid'], default: 'resend' },
    providerMessageId: String,
    status: { type: String, index: true },
    metadata: Schema.Types.Mixed
  },
  baseOptions
);
withUpdatedAtIndex(emailEventSchema);

export const EmailEvent = models.EmailEvent || model('EmailEvent', emailEventSchema);
