import { describe, expect, it } from 'vitest';

function transition(current: string, event: 'approve' | 'send' | 'suspend') {
  if (event === 'suspend') return 'suspended';
  if (current === 'draft' && event === 'approve') return 'approved';
  if (current === 'approved' && event === 'send') return 'sent';
  return current;
}

describe('access transitions', () => {
  it('draft -> approved -> sent', () => {
    const approved = transition('draft', 'approve');
    expect(approved).toBe('approved');
    expect(transition(approved, 'send')).toBe('sent');
  });

  it('any state can suspend', () => {
    expect(transition('sent', 'suspend')).toBe('suspended');
  });
});
