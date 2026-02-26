import { describe, expect, it } from 'vitest';
import { shouldSendReminder } from '@/server/reminders';

describe('reminder scheduling', () => {
  it('allows first reminder', () => {
    expect(shouldSendReminder(null)).toBe(true);
  });

  it('blocks if less than 24h', () => {
    const now = new Date('2025-01-02T00:00:00Z');
    const last = new Date('2025-01-01T12:00:00Z');
    expect(shouldSendReminder(last, now)).toBe(false);
  });

  it('allows if >=24h', () => {
    const now = new Date('2025-01-02T00:00:00Z');
    const last = new Date('2025-01-01T00:00:00Z');
    expect(shouldSendReminder(last, now)).toBe(true);
  });
});
