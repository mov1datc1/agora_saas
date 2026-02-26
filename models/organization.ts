import { Schema, model, models } from 'mongoose';
import { baseOptions, softDeleteFields, withUpdatedAtIndex } from './common';

const organizationSchema = new Schema(
  {
    type: { type: String, enum: ['independent_lawyer', 'firm'], required: true, index: true },
    legalName: { type: String, required: true, index: true },
    taxId: { type: String },
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ...softDeleteFields
  },
  baseOptions
);
withUpdatedAtIndex(organizationSchema);

export const Organization = models.Organization || model('Organization', organizationSchema);
