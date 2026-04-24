import { describe, it, expect } from 'vitest';
import { resolveBaileyCollection, collectWage, updatePrices, initEconomy, produceGoods, conductTrade, balanceDemand, getPrice, payNpc, chargeNpc, resolveJobShift } from '../../src/sim/EconomySystem';

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

  it('should initialize economy', () => {
    const economy = initEconomy();
    expect(economy.length).toBeGreaterThan(0);
    expect(economy[0].resource).toBe('bread');
    expect(economy[0].supply).toBeGreaterThanOrEqual(50);
    expect(economy[0].demand).toBeGreaterThanOrEqual(40);
  });

  it('should produce goods based on job', () => {
    const economy = initEconomy();
    const breadSupply = economy.find(e => e.resource === 'bread')?.supply || 0;

    // Farmer produces grain, so grain supply should go up, bread should stay same
    const newEconomy = produceGoods(economy, 'farmer');
    const grainSupply = newEconomy.find(e => e.resource === 'grain')?.supply || 0;
    const oldGrainSupply = economy.find(e => e.resource === 'grain')?.supply || 0;

    expect(grainSupply).toBe(oldGrainSupply + 3);
    expect(newEconomy.find(e => e.resource === 'bread')?.supply).toBe(breadSupply);
  });

  it('should collect zero wage for none job', () => {
    expect(collectWage('none')).toBe(0);
  });

  it('should conduct trade', () => {
    let economy = initEconomy();
    const oldSupply = economy.find(e => e.resource === 'bread')?.supply || 0;
    const oldDemand = economy.find(e => e.resource === 'bread')?.demand || 0;

    economy = conductTrade(economy, 'bread', 10);
    expect(economy.find(e => e.resource === 'bread')?.supply).toBe(oldSupply - 10);
    expect(economy.find(e => e.resource === 'bread')?.demand).toBe(oldDemand + 5);
  });

  it('should update prices based on supply/demand', () => {
    let economy = [{ resource: 'test', base_price: 10, current_price: 10, supply: 10, demand: 20 }];
    economy = updatePrices(economy);
    // ratio = 20 / 10 = 2.0. multiplier = 0.5 + 2.0 = 2.5
    // new price = 10 * 2.5 = 25
    expect(economy[0].current_price).toBe(25);
  });

  it('should balance demand towards supply', () => {
    let economy = [{ resource: 'test', base_price: 10, current_price: 10, supply: 50, demand: 10 }];
    economy = balanceDemand(economy);
    // drift = (50 - 10) * 0.05 = 2
    // new demand = 10 + 2 = 12
    expect(economy[0].demand).toBe(12);
  });

  it('should get correct price', () => {
    const economy = [{ resource: 'test', base_price: 10, current_price: 15, supply: 10, demand: 10 }];
    expect(getPrice(economy, 'test')).toBe(15);
    expect(getPrice(economy, 'unknown')).toBe(10); // Default fallback
  });

  it('should pay NPC', () => {
    const npc = { stats: { gold: 10 } } as any;
    const newStats = payNpc(npc, 5);
    expect(newStats.gold).toBe(15);
  });

  it('should charge NPC if they can afford', () => {
    const npc = { stats: { gold: 10 } } as any;
    const economy = [{ resource: 'bread', base_price: 5, current_price: 5, supply: 10, demand: 10 }];
    const result = chargeNpc(npc, economy);
    expect(result.canAfford).toBe(true);
    expect(result.stats.gold).toBe(5);
  });

  it('should not charge NPC if they cannot afford', () => {
    const npc = { stats: { gold: 2 } } as any;
    const economy = [{ resource: 'bread', base_price: 5, current_price: 5, supply: 10, demand: 10 }];
    const result = chargeNpc(npc, economy);
    expect(result.canAfford).toBe(false);
    expect(result.stats.gold).toBe(2);
  });

  it('should resolve job shift', () => {
    const state = {
      player: {
        skills: { housekeeping: 50 },
        life_sim: { needs: { energy: 80 } }
      }
    };
    const result = resolveJobShift(state, 'housekeeping', 2);
    // baseRate 10 * hours 2 = 20
    // skillMult = 1 + 0.5 = 1.5
    // fatigueMult = 0.8
    // gold = floor(20 * 1.5 * 0.8) = floor(30 * 0.8) = 24
    expect(result.gold).toBe(24);
    expect(result.stamina_drain).toBe(30);
    expect(result.stress_gain).toBe(10);
    expect(result.housekeeping_exp).toBe(4);
  });
});
