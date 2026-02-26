import { Schema, model, models } from 'mongoose';
import { baseOptions, withUpdatedAtIndex } from './common';

const analyticsSnapshotSchema = new Schema(
  {
    snapshotDate: { type: Date, required: true, unique: true, index: true },
    mrr: { type: Number, default: 0 },
    churnRate: { type: Number, default: 0 },
    newSubscriptions: { type: Number, default: 0 },
    cancellations: { type: Number, default: 0 },
    activeTrials: { type: Number, default: 0 }
  },
  baseOptions
);
analyticsSnapshotSchema.index({ snapshotDate: -1 });
withUpdatedAtIndex(analyticsSnapshotSchema);

export const AnalyticsSnapshot = models.AnalyticsSnapshot || model('AnalyticsSnapshot', analyticsSnapshotSchema);
