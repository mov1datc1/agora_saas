import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const invoiceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    stripeInvoiceId: { type: String, unique: true, index: true },
    amountDue: Number,
    amountPaid: Number,
    currency: String,
    status: { type: String, index: true },
    hostedInvoiceUrl: String,
    invoicePdf: String,
    paidAt: Date,
    periodStart: Date,
    periodEnd: Date
  },
  baseOptions
);
invoiceSchema.index({ userId: 1, createdAt: -1 });
withUpdatedAtIndex(invoiceSchema);

export const Invoice = models.Invoice || model('Invoice', invoiceSchema);
