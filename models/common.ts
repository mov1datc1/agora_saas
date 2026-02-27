import { Schema } from 'mongoose';

export const baseOptions = { timestamps: true };

export const softDeleteFields = {
  deletedAt: { type: Date, default: null, index: true }
};

export const trialEndsAt = {
  type: Date,
  index: true
};

export const statusIndexed = {
  type: String,
  index: true,
  required: true
};

export function withUpdatedAtIndex(schema: Schema) {
  schema.index({ updatedAt: -1 });
  schema.index({ createdAt: -1 });
}
