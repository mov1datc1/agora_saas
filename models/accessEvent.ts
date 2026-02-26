import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const accessEventSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    credentialId: { type: Schema.Types.ObjectId, ref: 'AccessCredential', index: true },
    eventType: { type: String, required: true, index: true },
    actorUserId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    metadata: Schema.Types.Mixed
  },
  baseOptions
);
accessEventSchema.index({ eventType: 1, createdAt: -1 });
withUpdatedAtIndex(accessEventSchema);

export const AccessEvent = models.AccessEvent || model('AccessEvent', accessEventSchema);
