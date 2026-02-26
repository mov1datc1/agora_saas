import { Schema, model, models } from 'mongoose';
import { baseOptions, softDeleteFields, withUpdatedAtIndex } from './common';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer', index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    resetTokenHash: { type: String },
    resetTokenExpiresAt: { type: Date, index: true },
    ...softDeleteFields
  },
  baseOptions
);
withUpdatedAtIndex(userSchema);

export const User = models.User || model('User', userSchema);
