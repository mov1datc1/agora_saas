import { describe, expect, it } from 'vitest';
import { PRICES, annualSavings, resolvePlanAmount } from '@/lib/pricing';

describe('pricing', () => {
  it('uses fixed annual prices without decimal artifacts', () => {
    expect(PRICES.basic.annual).toBe(300);
    expect(PRICES.pro.annual).toBe(600);
  });

  it('returns annual savings', () => {
    expect(annualSavings(32)).toBe(76.8);
  });

  it('resolves plan amount', () => {
    expect(resolvePlanAmount('pro', 'monthly')).toBe(64);
  });
});
