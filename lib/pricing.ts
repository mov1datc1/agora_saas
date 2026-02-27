export const PRICES = {
  basic: { monthly: 32, annual: 32 * 12 * 0.8 },
  pro: { monthly: 64, annual: 64 * 12 * 0.8 }
} as const;

export type PlanKey = keyof typeof PRICES;
export type PlanInterval = 'monthly' | 'annual';

export function annualSavings(monthlyPrice: number) {
  return monthlyPrice * 12 * 0.2;
}

export function resolvePlanAmount(plan: PlanKey, interval: PlanInterval) {
  return PRICES[plan][interval];
}
