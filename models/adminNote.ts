import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const adminNoteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    adminUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true }
  },
  baseOptions
);
adminNoteSchema.index({ userId: 1, createdAt: -1 });
withUpdatedAtIndex(adminNoteSchema);

export const AdminNote = models.AdminNote || model('AdminNote', adminNoteSchema);
