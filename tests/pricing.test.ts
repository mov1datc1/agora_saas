import { describe, expect, it } from 'vitest';
import { PRICES, annualSavings, resolvePlanAmount } from '@/lib/pricing';

describe('pricing', () => {
  it('applies 20% annual discount', () => {
    expect(PRICES.basic.annual).toBe(307.2);
    expect(PRICES.pro.annual).toBe(614.4);
  });

  it('returns annual savings', () => {
    expect(annualSavings(32)).toBe(76.8);
  });

  it('resolves plan amount', () => {
    expect(resolvePlanAmount('pro', 'monthly')).toBe(64);
  });
});
