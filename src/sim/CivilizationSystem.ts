/**
 * CivilizationSystem — orchestrates procedural state, policy, and global development.
 * Pure functions for the SimWorld.
 */
import { SimWorld, GovernmentState, GovernmentPolicy, FactionId } from './types';

/**
 * Tick the civilization state.
 * Handles treasury growth, stability drift, and policy enforcement.
 */
export function tickCivilization(world: SimWorld): SimWorld {
  const civ = { ...world.civilization };
  const nextGovernments = civ.governments.map(gov => {
    const nextGov = { ...gov };
    
    // 1. Treasury & Taxes
    // Increase treasury based on stability and tax policies
    const totalTaxRate = gov.policies.reduce((sum, p) => sum + p.tax_rate, 0.05);
    const taxIncome = 100 * totalTaxRate * (gov.stability / 100);
    nextGov.treasury += taxIncome;

    // 2. Stability Drift
    // Stability moves toward a baseline (70), influenced by treasury and corruption
    const baseline = 70;
    const corruptionPenalty = gov.corruption_level * 0.2;
    const treasuryBonus = Math.min(20, nextGov.treasury / 1000);
    const targetStability = baseline - corruptionPenalty + treasuryBonus;
    
    nextGov.stability += (targetStability - nextGov.stability) * 0.05;

    // 3. Emergent Policy Changes
    // If stability is low, govt might enact emergency enforcement
    if (nextGov.stability < 40 && !nextGov.policies.some(p => p.id === 'martial_law')) {
      nextGov.policies.push(getEmergencyMartialLawPolicy());
    }

    return nextGov;
  });

  return {
    ...world,
    civilization: {
      ...civ,
      governments: nextGovernments
    }
  };
}

/**
 * Returns a static policy template for martial law.
 */
function getEmergencyMartialLawPolicy(): GovernmentPolicy {
  return {
    id: 'martial_law',
    name: 'Martial Law',
    description: 'Extreme enforcement due to regional instability.',
    affected_resources: ['alcohol', 'moonsugar'],
    price_multiplier: 1.5,
    tax_rate: 0.1,
    is_illegal: true,
    enforcement_priority: 90
  };
}

/**
 * Helper to get active laws for a location based on jurisdiction.
 */
export function getActiveLaws(world: SimWorld, locationId: string): GovernmentPolicy[] {
  // Find which government controls this location
  const gov = world.civilization.governments.find(g => 
    world.faction_hierarchies[g.faction_id]?.territories.includes(locationId)
  );
  return gov?.policies || [];
}
