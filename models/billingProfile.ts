import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const billingProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    addressLine1: String,
    addressLine2: String,
    city: String,
    country: String,
    postalCode: String,
    taxId: String
  },
  baseOptions
);
withUpdatedAtIndex(billingProfileSchema);

export const BillingProfile = models.BillingProfile || model('BillingProfile', billingProfileSchema);
