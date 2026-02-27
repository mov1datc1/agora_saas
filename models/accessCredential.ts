import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const accessCredentialSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    status: { type: String, enum: ['draft', 'approved', 'sent', 'suspended'], default: 'draft', index: true },
    username: String,
    temporaryPassword: String,
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    sentAt: Date,
    suspendedAt: Date
  },
  baseOptions
);
withUpdatedAtIndex(accessCredentialSchema);

export const AccessCredential = models.AccessCredential || model('AccessCredential', accessCredentialSchema);
