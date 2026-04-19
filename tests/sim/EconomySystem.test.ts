import { describe, it, expect } from 'vitest';
import { resolveBaileyCollection, collectWage, updatePrices } from '../../src/sim/EconomySystem';

describe('EconomySystem', () => {
  it('should collect wages correctly', () => {
    const wage = collectWage('guard');
    expect(wage).toBeGreaterThanOrEqual(12);
    expect(wage).toBeLessThanOrEqual(17);
  });

  it('should handle Bailey collection - default case', () => {
    const mockState = {
      player: {
        gold: 10,
        bailey_payment: {
          weekly_amount: 100,
          due_day: 0,
          missed_payments: 0,
          debt: 0,
          punishment_level: 0
        }
      },
      world: {
        day: 1
      }
    };
    
    const { payment, logText } = resolveBaileyCollection(mockState);
    expect(payment.missed_payments).toBe(1);
    expect(payment.debt).toBe(100);
    expect(logText).toContain('failed to pay');
  });

  it('should handle Bailey collection - successful payment', () => {
    const mockState = {
      player: {
        gold: 1000,
        bailey_payment: {
          weekly_amount: 100,
          due_day: 0,
          missed_payments: 1,
          debt: 100,
          punishment_level: 1
        }
      },
      world: {
        day: 1
      }
    };
    
    const { payment, logText } = resolveBaileyCollection(mockState);
    expect(payment.missed_payments).toBe(0);
    expect(payment.debt).toBe(0);
    expect(logText).toContain('cleared');
  });
});
