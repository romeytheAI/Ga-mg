/**
 * MagicSystem — high-fidelity arcane logic, soul trapping, and spell resolution.
 * Pure logic for the arcane simulation core.
 */
import { GameState, PlayerArcane, ActiveEffect, Spell } from '../types';

/**
 * Tick magic state: mana regen, active effect decay, and ritual progress.
 */
export function tickMagic(state: GameState, hours: number): PlayerArcane {
  const arcane = { ...state.player.arcane };
  const willpowerFactor = state.player.stats.willpower / 100;
  
  // 1. Mana Regeneration
  // Lore: Regens faster with high willpower, slower with high corruption taint.
  const baseRegen = (arcane.max_mana * 0.1) * willpowerFactor;
  const taintPenalty = arcane.corruption_taint * 0.05;
  arcane.mana = Math.min(arcane.max_mana, arcane.mana + (baseRegen - taintPenalty) * hours);

  // 2. Active Effects Decay
  arcane.active_effects = arcane.active_effects
    .map(effect => ({ ...effect, duration: effect.duration - hours }))
    .filter(effect => effect.duration > 0);

  // 3. Ritual Progress
  arcane.active_rituals = arcane.active_rituals.map(rit => ({
    ...rit,
    progress: Math.min(100, rit.progress + (hours * 2))
  })).filter(rit => rit.progress < 100);

  return arcane;
}

/**
 * Handle Soul Trapping.
 * Checks if a 'Soul Trap' effect is active on the target entity.
 */
export function attemptSoulTrap(state: GameState, targetTier: string): GameState {
  const arcane = { ...state.player.arcane };
  const hasSoulTrapActive = arcane.active_effects.some(e => e.effect_id === 'soul_trap');

  if (!hasSoulTrapActive) return state;

  // Find smallest empty gem that can fit the soul
  const sizes = ['petty', 'lesser', 'common', 'greater', 'grand', 'black'];
  const targetSizeIdx = sizes.indexOf(targetTier.toLowerCase());

  const emptyGem = arcane.soul_gems.find(g => !g.filled && sizes.indexOf(g.size) >= targetSizeIdx);

  if (emptyGem) {
    emptyGem.filled = true;
    emptyGem.soul_type = targetTier;
  }

  return { ...state, player: { ...state.player, arcane } };
}

/**
 * Cast a specific spell from the spellbook.
 */
export function castSpell(state: GameState, spellId: string): { success: boolean, newState: GameState, log: string } {
  const spell = state.player.arcane.spells.find(s => s.id === spellId);
  if (!spell) return { success: false, newState: state, log: "Spell not known." };

  if (state.player.arcane.mana < spell.magicka_cost) {
    return { success: false, newState: state, log: "Insufficient magicka." };
  }

  const nextArcane = { ...state.player.arcane };
  nextArcane.mana -= spell.magicka_cost;

  // Apply effect based on school
  const effect: ActiveEffect = {
    id: `fx_${Date.now()}`,
    name: spell.name,
    type: spell.school === 'destruction' ? 'debuff' : 'buff',
    duration: 1, // 1 hour standard
    magnitude: 10 + (state.player.skills.lore_mastery / 10),
    school: spell.school
  };
  nextArcane.active_effects.push(effect);

  const nextState = { ...state, player: { ...state.player, arcane: nextArcane } };
  return { success: true, newState: nextState, log: `You manifest the energies of ${spell.school}: ${spell.name}.` };
}
