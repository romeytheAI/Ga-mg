import { GameState, StatKey } from '../types';
import { SimWorld, HordeRequest } from '../sim/types';
import { LOCATIONS } from '../data/locations';
import { RECIPES, buildResultItem, canCookRecipe } from '../data/recipes';
import { QUESTS } from '../data/quests';
import { initialState } from '../state/initialState';
import { tickSimulation } from '../sim/SimulationEngine';
import { advanceWeekDay, computeDailyStatDeltas } from '../utils/scheduleEngine';
import { resolveRelationshipInteraction } from '../utils/relationshipEngine';
import { applyRepWithRivalSpillover, processCrimeEvent, processPayBounty, processServeSentence, defaultCriminalRecord, defaultFactions } from '../utils/factionEngine';
import { computeClothingState, exposureConsequences } from '../utils/clothingState';

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function withClothingState(player: GameState['player']) {
  const clothing_state = computeClothingState(player.clothing, player.clothing_state);
  const updatedPlayer = {
    ...player,
    clothing_state,
    temperature: { ...player.temperature, clothing_warmth: clothing_state.summary.warmth },
  };
  return { player: updatedPlayer, clothing_state };
}

export function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {
    case 'SET_PLAYER_AVATAR':
      return {
        ...state,
        player: {
          ...state.player,
          avatar_url: action.payload
        }
      };
    case 'SET_ACTIVE_ENCOUNTER':
      return {
        ...state,
        world: {
          ...state.world,
          active_encounter: action.payload
        }
      };
    case 'SET_STORY_EVENT':
      return {
        ...state,
        world: { ...state.world, active_story_event: action.payload }
      };
    case 'CLEAR_STORY_EVENT':
      return {
        ...state,
        world: { ...state.world, active_story_event: null }
      };

    case 'UPDATE_ACTIVE_ENCOUNTER':
      return {
        ...state,
        world: {
          ...state.world,
          active_encounter: state.world.active_encounter ? {
            ...state.world.active_encounter,
            ...action.payload
          } : null
        }
      };
    case 'START_TURN':
      return {
        ...state,
        world: {
          ...state.world,
          last_intent: action.payload.intent || null
        },
        ui: {
          ...state.ui,
          isPollingText: true,
          currentLog: [...state.ui.currentLog, { text: `> ${action.payload.actionText}`, type: 'action' }]
        }
      };
    case 'RESOLVE_TEXT': {
      const { parsedText, actionText } = action.payload;
      if (!parsedText) return { ...state, ui: { ...state.ui, isPollingText: false } };

      // 1. Narrative log
      const narrativeText = parsedText.narrative_text || '';
      const newLog = narrativeText
        ? [...state.ui.currentLog, { text: narrativeText, type: 'narrative' as const }]
        : state.ui.currentLog;

      // 2. Apply stat deltas
      const newStats = { ...state.player.stats };
      const appliedDeltas: Partial<Record<StatKey, number>> = {};
      if (parsedText.stat_deltas) {
        for (const [key, value] of Object.entries(parsedText.stat_deltas)) {
          if (typeof value === 'number' && key in newStats) {
            const k = key as StatKey;
            const maxKey = `max_${k}` as keyof typeof newStats;
            const cap = typeof newStats[maxKey] === 'number' ? (newStats[maxKey] as number) : 100;
            newStats[k] = Math.max(0, Math.min(cap, newStats[k] + value));
            appliedDeltas[k] = value;
          }
        }
      }

      // 3. Apply skill deltas
      const newSkills = { ...state.player.skills };
      if (parsedText.skill_deltas) {
        for (const [key, value] of Object.entries(parsedText.skill_deltas)) {
          if (typeof value === 'number' && key in newSkills) {
            const k = key as keyof typeof newSkills;
            newSkills[k] = Math.max(0, Math.min(100, newSkills[k] + value));
          }
        }
      }

      // 4. Add new items to inventory
      let newInventory = [...state.player.inventory];
      if (parsedText.new_items && Array.isArray(parsedText.new_items)) {
        for (let i = 0; i < parsedText.new_items.length; i++) {
          const item = parsedText.new_items[i];
          newInventory.push({
            id: item.id || `item_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
            name: item.name || 'Unknown Item',
            type: item.type || 'misc',
            slot: item.slot || undefined,
            rarity: item.rarity || 'common',
            description: item.description || '',
            value: item.value ?? 1,
            weight: item.weight ?? 0.1,
            integrity: item.integrity ?? 100,
            max_integrity: item.max_integrity ?? 100,
            stats: item.stats || undefined,
            lore: item.lore || undefined,
            special_effect: item.special_effect || undefined,
          });
        }
      }

      // 4b. Convert Gold Coins to gold currency
      let goldEarned = 0;
      newInventory = newInventory.filter(item => {
        if (item.name === 'Gold Coin' && item.type === 'misc') {
          goldEarned += item.value || 1;
          return false;
        }
        return true;
      });

      // 5. Equipment integrity degradation
      if (typeof parsedText.equipment_integrity_delta === 'number' && parsedText.equipment_integrity_delta !== 0) {
        newInventory = newInventory.map(item => {
          if (item.is_equipped && item.integrity !== undefined) {
            const newIntegrity = Math.max(0, (item.integrity ?? 100) + parsedText.equipment_integrity_delta);
            return { ...item, integrity: newIntegrity };
          }
          return item;
        });
      }

      const syncedClothing = Object.fromEntries(
        Object.entries(state.player.clothing).map(([slot, equipped]) => [
          slot,
          equipped ? newInventory.find(i => i.id === equipped.id) ?? equipped : null,
        ])
      ) as typeof state.player.clothing;

      // 6. Combat injury
      let newAnatomy = state.player.anatomy;
      if (parsedText.combat_injury) {
        const injury = parsedText.combat_injury;
        newAnatomy = {
          ...newAnatomy,
          injuries: [...newAnatomy.injuries, {
            description: injury.description || 'Wound',
            stamina_penalty: injury.stamina_penalty || 0,
            health_penalty: injury.health_penalty || 0,
          }],
        };
        // Apply injury penalties to stats
        if (injury.stamina_penalty) {
          newStats.stamina = Math.max(0, newStats.stamina - injury.stamina_penalty);
          appliedDeltas.stamina = (appliedDeltas.stamina || 0) - injury.stamina_penalty;
        }
        if (injury.health_penalty) {
          newStats.health = Math.max(0, newStats.health - injury.health_penalty);
          appliedDeltas.health = (appliedDeltas.health || 0) - injury.health_penalty;
        }
      }

      // 7. Afflictions
      let newAfflictions = [...state.player.afflictions];
      if (parsedText.new_affliction && typeof parsedText.new_affliction === 'string') {
        if (!newAfflictions.includes(parsedText.new_affliction)) {
          newAfflictions.push(parsedText.new_affliction);
        }
      }

      // 8. Quests
      let newQuests = [...state.player.quests];
      if (parsedText.new_quests && Array.isArray(parsedText.new_quests)) {
        for (const q of parsedText.new_quests) {
          if (q.id && !newQuests.some(eq => eq.id === q.id)) {
            newQuests.push({
              id: q.id,
              title: q.title || 'Unknown Quest',
              description: q.description || '',
              type: (['main', 'side', 'daily', 'romance'] as const).includes(q.type) ? q.type as 'main' | 'side' | 'daily' | 'romance' : 'side',
              status: 'active' as const,
            });
          }
        }
      }
      if (parsedText.completed_quests && Array.isArray(parsedText.completed_quests)) {
        newQuests = newQuests.map(q =>
          parsedText.completed_quests.includes(q.id) ? { ...q, status: 'completed' as const } : q
        );
      }

      // 9. Location change
      let newLocation = state.world.current_location;
      if (parsedText.new_location && LOCATIONS[parsedText.new_location]) {
        newLocation = LOCATIONS[parsedText.new_location];
      }

      // 10. Time advancement
      const hoursPassed = typeof parsedText.hours_passed === 'number' ? parsedText.hours_passed : 1;
      let newHour = state.world.hour + hoursPassed;
      let newDay = state.world.day;
      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
      }

      // 11. Follow-up choices
      let newChoices = parsedText.follow_up_choices && Array.isArray(parsedText.follow_up_choices)
        ? parsedText.follow_up_choices
        : (newLocation.actions || []);

      // 12. Memory graph
      let newMemoryGraph = [...state.memory_graph];
      const memoryEntry = parsedText.memory_entry
        || (narrativeText ? `Day ${newDay}: ${actionText}` : null);
      if (memoryEntry) {
        newMemoryGraph.push(memoryEntry);
      }

      // 13. Psych profile adjustments from stat changes
      const newPsych = { ...state.player.psych_profile };
      if (appliedDeltas.purity && appliedDeltas.purity < 0) {
        newPsych.promiscuity = Math.min(100, newPsych.promiscuity + Math.abs(appliedDeltas.purity) * 0.2);
      }
      if (appliedDeltas.corruption && appliedDeltas.corruption > 0) {
        newPsych.submission_index = Math.min(100, newPsych.submission_index + appliedDeltas.corruption * 0.1);
      }

      // 13b. Lewdity stats adjustments (DoL-parity)
      let notoriety = state.player.notoriety;
      let newLewdity = { ...state.player.lewdity_stats };
      if (appliedDeltas.purity && appliedDeltas.purity < 0) {
        newLewdity.exhibitionism = Math.min(100, newLewdity.exhibitionism + Math.abs(appliedDeltas.purity) * 0.15);
        newLewdity.promiscuity = Math.min(100, newLewdity.promiscuity + Math.abs(appliedDeltas.purity) * 0.1);
      }
      if (appliedDeltas.lust && appliedDeltas.lust > 0) {
        newLewdity.deviancy = Math.min(100, newLewdity.deviancy + appliedDeltas.lust * 0.05);
      }
      if (appliedDeltas.pain && appliedDeltas.pain > 0 && appliedDeltas.lust && appliedDeltas.lust > 0) {
        newLewdity.masochism = Math.min(100, newLewdity.masochism + 0.5);
      }

      // 13c. Body fluids update (DoL-parity)
      const newBodyFluids = { ...state.player.body_fluids };
      const earlyIntent = state.world.last_intent;
      newBodyFluids.sweat = Math.min(100, Math.max(0, newBodyFluids.sweat + (earlyIntent === 'work' ? 10 : -5)));
      if (appliedDeltas.arousal && appliedDeltas.arousal > 0) {
        newBodyFluids.arousal_wetness = Math.min(100, newBodyFluids.arousal_wetness + appliedDeltas.arousal * 0.3);
      } else {
        newBodyFluids.arousal_wetness = Math.max(0, newBodyFluids.arousal_wetness - 5);
      }
      if (appliedDeltas.stress && appliedDeltas.stress > 0 && newStats.stress > 80) {
        newBodyFluids.tears = Math.min(100, newBodyFluids.tears + 10);
      } else {
        newBodyFluids.tears = Math.max(0, newBodyFluids.tears - 10);
      }

      // Define drainHours early for use in decay calculations
      const drainHours = hoursPassed;

      // DoL: Semen level decay over time
      newBodyFluids.semen_level = Math.max(0, newBodyFluids.semen_level - 3 * drainHours);

      // DoL: Saliva passive decay
      newBodyFluids.saliva = Math.max(0, newBodyFluids.saliva - 2 * drainHours);

      // DoL: Milk production/decay handled in biology section below

      // 13d. Sensitivity adjustments (DoL-parity) — exposure increases sensitivity
      const newSensitivity = { ...state.player.sensitivity };
      if (appliedDeltas.arousal && appliedDeltas.arousal > 0) {
        const senKeys: (keyof typeof newSensitivity)[] = ['mouth', 'chest', 'genitals', 'bottom', 'thighs', 'feet', 'hands'];
        for (const k of senKeys) {
          newSensitivity[k] = Math.min(100, newSensitivity[k] + appliedDeltas.arousal * 0.05);
        }
      }

      // 14. Player needs decay (DoL-parity life-sim loop)
      const newNeeds = { ...state.player.life_sim.needs };
      const intent = state.world.last_intent;

      // Passive drain per hour
      newNeeds.hunger = Math.max(0, newNeeds.hunger - 3 * drainHours);
      newNeeds.thirst = Math.max(0, newNeeds.thirst - 4 * drainHours);
      newNeeds.energy = Math.max(0, newNeeds.energy - 2 * drainHours);
      newNeeds.hygiene = Math.max(0, newNeeds.hygiene - 1.5 * drainHours);
      newNeeds.social = Math.max(0, newNeeds.social - 1 * drainHours);

      // Activity-specific modifiers
      if (intent === 'work') {
        newNeeds.hunger = Math.max(0, newNeeds.hunger - 5 * drainHours);
        newNeeds.energy = Math.max(0, newNeeds.energy - 5 * drainHours);
        newNeeds.hygiene = Math.max(0, newNeeds.hygiene - 3 * drainHours);
      }
      if (intent === 'social') {
        newNeeds.social = Math.min(100, newNeeds.social + 15 * drainHours);
      }
      if (intent === 'neutral' && actionText?.toLowerCase().includes('sleep')) {
        newNeeds.energy = Math.min(100, newNeeds.energy + 30 * drainHours);
      }
      if (intent === 'neutral' && (actionText?.toLowerCase().includes('eat') || actionText?.toLowerCase().includes('food') || actionText?.toLowerCase().includes('bread'))) {
        newNeeds.hunger = Math.min(100, newNeeds.hunger + 25);
      }
      if (intent === 'neutral' && (actionText?.toLowerCase().includes('drink') || actionText?.toLowerCase().includes('water') || actionText?.toLowerCase().includes('ale') || actionText?.toLowerCase().includes('milk'))) {
        newNeeds.thirst = Math.min(100, newNeeds.thirst + 30);
      }
      if (intent === 'neutral' && (actionText?.toLowerCase().includes('swim') || actionText?.toLowerCase().includes('wash') || actionText?.toLowerCase().includes('bath'))) {
        newNeeds.hygiene = Math.min(100, newNeeds.hygiene + 40);
      }

      // Low needs → stat penalties (applied directly to newStats)
      if (newNeeds.hunger <= 20) {
        newStats.health = Math.max(0, newStats.health - 2);
        newStats.stamina = Math.max(0, newStats.stamina - 3);
      }
      if (newNeeds.energy <= 20) {
        newStats.willpower = Math.max(0, newStats.willpower - 3);
        newStats.stamina = Math.max(0, newStats.stamina - 2);
      }
      if (newNeeds.hygiene <= 20) {
        newStats.allure = Math.max(0, newStats.allure - 2);
        newStats.stress = Math.min(100, newStats.stress + 2);
      }
      if (newNeeds.social <= 15) {
        newStats.stress = Math.min(100, newStats.stress + 3);
        newStats.willpower = Math.max(0, newStats.willpower - 1);
      }
      if (newNeeds.thirst <= 15) {
        newStats.health = Math.max(0, newStats.health - 3);
        newStats.stamina = Math.max(0, newStats.stamina - 5);
      }

      const newLifeSim = {
        ...state.player.life_sim,
        needs: newNeeds,
      };

      // 15. Weather effects on player stats (DoL-parity)
      const weather = state.world.weather;
      if (weather === 'Blizzard' || weather === 'Freezing') {
        newStats.stamina = Math.max(0, newStats.stamina - 5 * drainHours);
        newStats.health = Math.max(0, newStats.health - 2 * drainHours);
      } else if (weather === 'Cold Rain' || weather === 'Light Snow' || weather === 'Clear and Cold') {
        newStats.stamina = Math.max(0, newStats.stamina - 2 * drainHours);
      }
      if (weather === 'Rainy' || weather === 'Cold Rain' || weather === 'Drizzle') {
        newNeeds.hygiene = Math.max(0, newNeeds.hygiene - 2 * drainHours);
      }
      if (weather === 'Scorching' || weather === 'Hot' || weather === 'Humid') {
        newStats.stress = Math.min(100, newStats.stress + 2 * drainHours);
        newNeeds.thirst = Math.max(0, newNeeds.thirst - 3 * drainHours);
      }
      if (weather === 'Thunderstorm') {
        newStats.stress = Math.min(100, newStats.stress + 4 * drainHours);
      }

      // 15b. Temperature / Warmth system (DoL-parity)
      let newTemperature = { ...state.player.temperature };
      // Compute ambient temp from weather
      const weatherTempMap: Record<string, number> = {
        'Blizzard': -15, 'Freezing': -10, 'Light Snow': -5, 'Clear and Cold': -2,
        'Cold Rain': 2, 'Foggy': 8, 'Cloudy': 12, 'Drizzle': 10,
        'Clear': 18, 'Warm': 22, 'Hot': 30, 'Humid': 28, 'Scorching': 38,
        'Rainy': 10, 'Thunderstorm': 8,
      };
      newTemperature.ambient_temp = weatherTempMap[weather] ?? 12;
      // Compute clothing warmth from equipped items
      const equippedSlots = Object.values(state.player.clothing).filter(Boolean);
      newTemperature.clothing_warmth = Math.min(100, equippedSlots.length * 12);
      // Determine body temperature state
      const effectiveTemp = newTemperature.ambient_temp + newTemperature.clothing_warmth * 0.3;
      if (effectiveTemp < -5) newTemperature.body_temp = 'freezing';
      else if (effectiveTemp < 5) newTemperature.body_temp = 'cold';
      else if (effectiveTemp < 12) newTemperature.body_temp = 'chilly';
      else if (effectiveTemp < 28) newTemperature.body_temp = 'comfortable';
      else if (effectiveTemp < 35) newTemperature.body_temp = 'warm';
      else if (effectiveTemp < 42) newTemperature.body_temp = 'hot';
      else newTemperature.body_temp = 'overheating';
      // Temperature effects on stats
      if (newTemperature.body_temp === 'freezing') {
        newStats.health = Math.max(0, newStats.health - 3 * drainHours);
        newStats.stamina = Math.max(0, newStats.stamina - 5 * drainHours);
      } else if (newTemperature.body_temp === 'cold') {
        newStats.stamina = Math.max(0, newStats.stamina - 2 * drainHours);
      } else if (newTemperature.body_temp === 'overheating') {
        newStats.health = Math.max(0, newStats.health - 2 * drainHours);
        newNeeds.thirst = Math.max(0, newNeeds.thirst - 5 * drainHours);
      }

      // 15c. Bailey's Payment System (DoL-parity)
      const newBaileyPayment = { ...state.player.bailey_payment };
      const dayOfWeek = newDay % 7;
      const prevDayOfWeek = state.world.day % 7;
      // Check if payment day has passed during this turn
      if (dayOfWeek >= newBaileyPayment.due_day && prevDayOfWeek < newBaileyPayment.due_day && newDay > state.world.day) {
        if (state.player.gold >= newBaileyPayment.weekly_amount) {
          // Auto-pay if player has enough gold
          goldEarned -= newBaileyPayment.weekly_amount;
          if (newBaileyPayment.debt > 0) {
            newBaileyPayment.debt = Math.max(0, newBaileyPayment.debt - newBaileyPayment.weekly_amount);
          }
        } else {
          // Missed payment
          newBaileyPayment.missed_payments += 1;
          newBaileyPayment.debt += newBaileyPayment.weekly_amount;
          newBaileyPayment.punishment_level = Math.min(3, newBaileyPayment.missed_payments);
          // Punishment effects
          if (newBaileyPayment.punishment_level >= 1) {
            newStats.stress = Math.min(100, newStats.stress + 15 * newBaileyPayment.punishment_level);
            newStats.trauma = Math.min(100, newStats.trauma + 5 * newBaileyPayment.punishment_level);
          }
          if (newBaileyPayment.punishment_level >= 2) {
            newStats.pain = Math.min(100, newStats.pain + 10);
            newStats.health = Math.max(0, newStats.health - 10);
          }
        }
      }

      // 15d. Biology / Pregnancy / Fertility cycle (DoL-parity)
      const newBiology = { ...state.player.biology };

      // Fertility cycle progression (day-based)
      if (newDay > state.world.day) {
        const daysPassed = newDay - state.world.day;
        newBiology.cycle_day = (newBiology.cycle_day + daysPassed) % 28;

        // Update fertility cycle based on day
        if (newBiology.cycle_day < 5) {
          newBiology.fertility_cycle = 'Menstruation';
          newBiology.fertility = 0.1;
        } else if (newBiology.cycle_day < 12) {
          newBiology.fertility_cycle = 'Follicular';
          newBiology.fertility = 0.3;
        } else if (newBiology.cycle_day < 16) {
          newBiology.fertility_cycle = 'Ovulation';
          newBiology.fertility = 0.9;
        } else {
          newBiology.fertility_cycle = 'Luteal';
          newBiology.fertility = 0.4;
        }
      }

      // Incubation progression (pregnancy)
      if (newBiology.incubations.length > 0 && state.ui.settings.enable_pregnancy) {
        newBiology.incubations = newBiology.incubations.map(inc => {
          const daysPassed = newDay - state.world.day;
          const newProgress = Math.min(100, inc.progress + (daysPassed * 1.5));  // ~66 days to full term
          const newDaysRemaining = Math.max(0, inc.days_remaining - daysPassed);

          // Birth occurs when progress reaches 100
          if (newProgress >= 100 && inc.days_remaining <= 0) {
            // Add birth event to memory
            newMemoryGraph.push(`Day ${newDay}: Gave birth to ${inc.type}. A new chapter begins.`);

            // Post-partum debuff
            newBiology.post_partum_debuff = 7;  // 7 days of recovery

            // Unlock feat
            if (!state.player.feats.find(f => f.id === 'first_birth')?.unlocked) {
              // Will be dispatched separately after RESOLVE_TEXT
            }

            // Remove this incubation (birth complete)
            return null;
          }

          return { ...inc, progress: newProgress, days_remaining: newDaysRemaining };
        }).filter(Boolean) as any[];
      }

      // Post-partum recovery
      if (newBiology.post_partum_debuff > 0) {
        newBiology.post_partum_debuff = Math.max(0, newBiology.post_partum_debuff - (newDay - state.world.day));
        // Recovery debuffs
        newStats.stamina = Math.max(0, newStats.stamina - 5);
        newStats.health = Math.max(0, newStats.health - 3);
      }

      // Lactation increases if pregnant or recently gave birth
      if (newBiology.incubations.length > 0) {
        const avgProgress = newBiology.incubations.reduce((sum, inc) => sum + inc.progress, 0) / newBiology.incubations.length;
        if (avgProgress > 50) {
          newBiology.lactation_level = Math.min(100, newBiology.lactation_level + 0.5);
          newBodyFluids.milk = Math.min(100, newBodyFluids.milk + 2);
        }
      } else if (newBiology.post_partum_debuff > 0) {
        newBiology.lactation_level = Math.min(100, newBiology.lactation_level + 1);
        newBodyFluids.milk = Math.min(100, newBodyFluids.milk + 3);
      } else {
        // Lactation decreases over time if not pregnant/post-partum
        newBiology.lactation_level = Math.max(0, newBiology.lactation_level - 0.2);
        newBodyFluids.milk = Math.max(0, newBodyFluids.milk - 1);
      }

      // 15e. Dynamic Trait Acquisition (DoL-parity)
      let newTraits = [...state.player.traits];

      // Lewdity-based traits
      if (newLewdity.exhibitionism >= 70 && !newTraits.some(t => t.id === 'exhibitionist')) {
        newTraits.push({
          id: 'exhibitionist',
          name: 'Exhibitionist',
          description: 'You feel aroused when exposed to others. +5 allure in revealing clothes, -10 stress in public.',
          effects: { allure: 5, stress: -10 }
        });
      } else if (newLewdity.exhibitionism < 60 && newTraits.some(t => t.id === 'exhibitionist')) {
        newTraits = newTraits.filter(t => t.id !== 'exhibitionist');
      }

      if (newLewdity.promiscuity >= 80 && !newTraits.some(t => t.id === 'nymphomaniac')) {
        newTraits.push({
          id: 'nymphomaniac',
          name: 'Nymphomaniac',
          description: 'Your sexual appetite is insatiable. +10 lust gain, -5 willpower.',
          effects: { lust: 10, willpower: -5 }
        });
      } else if (newLewdity.promiscuity < 70 && newTraits.some(t => t.id === 'nymphomaniac')) {
        newTraits = newTraits.filter(t => t.id !== 'nymphomaniac');
      }

      if (newLewdity.masochism >= 60 && !newTraits.some(t => t.id === 'pain_seeker')) {
        newTraits.push({
          id: 'pain_seeker',
          name: 'Pain Seeker',
          description: 'Pain has become pleasure. Pain increases arousal instead of trauma.',
          effects: { pain: -10, lust: 5 }
        });
      } else if (newLewdity.masochism < 50 && newTraits.some(t => t.id === 'pain_seeker')) {
        newTraits = newTraits.filter(t => t.id !== 'pain_seeker');
      }

      if (newLewdity.deviancy >= 75 && !newTraits.some(t => t.id === 'deviant')) {
        newTraits.push({
          id: 'deviant',
          name: 'Deviant',
          description: 'Your tastes have become... unusual. +15% encounter variety, -5 purity.',
          effects: { purity: -5 }
        });
      } else if (newLewdity.deviancy < 65 && newTraits.some(t => t.id === 'deviant')) {
        newTraits = newTraits.filter(t => t.id !== 'deviant');
      }

      // Sexual skill mastery traits
      const sexualSkills = state.player.sexual_skills;
      for (const [skillName, skillValue] of Object.entries(sexualSkills)) {
        const traitId = `master_${skillName}`;
        if (skillValue >= 90 && !newTraits.some(t => t.id === traitId)) {
          newTraits.push({
            id: traitId,
            name: `Master of ${skillName.charAt(0).toUpperCase() + skillName.slice(1)}`,
            description: `You have mastered the art of ${skillName}. Encounters are more pleasurable and less stressful.`,
            effects: { stress: -5, lust: 3 }
          });
        } else if (skillValue < 80 && newTraits.some(t => t.id === traitId)) {
          newTraits = newTraits.filter(t => t.id !== traitId);
        }
      }

      const { clothing_state } = withClothingState({ ...state.player, clothing: syncedClothing });
      newTemperature = { ...newTemperature, clothing_warmth: clothing_state.summary.warmth };

      const exposureImpact = exposureConsequences(clothing_state, hoursPassed);
      newStats.stress = clamp(newStats.stress + exposureImpact.stress, 0, 100);
      newStats.hygiene = clamp(newStats.hygiene - exposureImpact.hygiene, 0, 100);
      newStats.allure = clamp(newStats.allure + exposureImpact.allure, 0, 100);
      newLewdity = { ...newLewdity, exhibitionism: clamp(newLewdity.exhibitionism + exposureImpact.exhibitionism, 0, 100) };
      notoriety = clamp(notoriety + exposureImpact.notoriety, 0, 100);

      // 16. Tick simulation engine if available
      let nextSimWorld = state.sim_world;
      if (nextSimWorld) {
        nextSimWorld = tickSimulation(nextSimWorld);
      }

      const basePlayer = {
        ...state.player,
        stats: newStats,
        skills: newSkills,
        inventory: newInventory,
        anatomy: newAnatomy,
        afflictions: newAfflictions,
        quests: newQuests,
        psych_profile: newPsych,
        lewdity_stats: newLewdity,
        body_fluids: newBodyFluids,
        sensitivity: newSensitivity,
        temperature: newTemperature,
        bailey_payment: newBaileyPayment,
        life_sim: newLifeSim,
        biology: newBiology,
        traits: newTraits,
        gold: state.player.gold + goldEarned,
        clothing: syncedClothing,
      } as GameState['player'];

      const playerWithClothing = withClothingState(basePlayer).player;

      return {
        ...state,
        player: playerWithClothing,
        world: {
          ...state.world,
          day: newDay,
          hour: newHour,
          turn_count: state.world.turn_count + 1,
          current_location: newLocation,
        },
        memory_graph: newMemoryGraph,
        sim_world: nextSimWorld,
        ui: {
          ...state.ui,
          isPollingText: false,
          currentLog: newLog,
          choices: newChoices,
          last_stat_deltas: Object.keys(appliedDeltas).length > 0 ? appliedDeltas : null,
        },
      };
    }
    case 'RESOLVE_IMAGE':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingImage: false,
          currentImage: action.payload
        }
      };
    case 'RESOLVE_IMAGE_FAILED':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingImage: false
        }
      };
    case 'START_AVATAR_GENERATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          isGeneratingAvatar: true
        }
      };
    case 'RESOLVE_AVATAR':
      return {
        ...state,
        player: {
          ...state.player,
          avatar_url: action.payload
        },
        ui: {
          ...state.ui,
          isGeneratingAvatar: false
        }
      };
    case 'RESOLVE_AVATAR_FAILED':
      return {
        ...state,
        ui: {
          ...state.ui,
          isGeneratingAvatar: false
        }
      };
    case 'RESOLVE_TEXT_FAILED':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingText: false,
          currentLog: [...state.ui.currentLog, { text: "The connection to Aetherius was severed. The weave of fate tangles and snaps. Try again.", type: 'narrative' }]
        }
      };
    case 'SET_API_KEY':
      return {
        ...state,
        ui: { ...state.ui, apiKey: action.payload }
      };
    case 'SET_HORDE_API_KEY':
      return {
        ...state,
        ui: { ...state.ui, hordeApiKey: action.payload }
      };
    case 'SET_TEXT_MODEL':
      return {
        ...state,
        ui: { ...state.ui, selectedTextModel: action.payload }
      };
    case 'SET_IMAGE_MODEL':
      return {
        ...state,
        ui: { ...state.ui, selectedImageModel: action.payload }
      };
    case 'SET_HORDE_STATUS':
      return {
        ...state,
        ui: { ...state.ui, horde_status: action.payload }
      };
    case 'CLEAR_ACTIVE_ENCOUNTER':
      return {
        ...state,
        world: {
          ...state.world,
          active_encounter: null
        }
      };
    case 'EQUIP_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item || item.type !== 'clothing') return state;
      
      const newInventory = state.player.inventory.map(i => i.id === itemId ? { ...i, is_equipped: true } : (i.slot === item.slot ? { ...i, is_equipped: false } : i));
      const newClothing = { ...state.player.clothing, [item.slot!]: item };
      const updated = withClothingState({
        ...state.player,
        inventory: newInventory,
        clothing: newClothing,
      }).player;
      
      return {
        ...state,
        player: updated
      };
    }
    case 'UNEQUIP_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item) return state;
      
      const newInventory = state.player.inventory.map(i => i.id === itemId ? { ...i, is_equipped: false } : i);
      const newClothing = { ...state.player.clothing, [item.slot!]: null };
      const updated = withClothingState({
        ...state.player,
        inventory: newInventory,
        clothing: newClothing,
      }).player;
      
      return {
        ...state,
        player: updated
      };
    }
    case 'USE_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item || item.type !== 'consumable') return state;
      
      const newInventory = state.player.inventory.filter(i => i.id !== itemId);
      const newStats = { ...state.player.stats };
      if (item.stats) {
        for (const [key, value] of Object.entries(item.stats)) {
          if (typeof value === 'number' && key in newStats) {
            newStats[key as StatKey] = Math.max(0, Math.min(100, newStats[key as StatKey] + value));
          }
        }
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: newInventory,
          stats: newStats
        }
      };
    }
    case 'DROP_ITEM': {
      const { itemId } = action.payload;
      return {
        ...state,
        player: {
          ...state.player,
          inventory: state.player.inventory.filter(i => i.id !== itemId)
        }
      };
    }
    case 'INTERACT_ITEM': {
      const { itemId } = action.payload;
      const item = state.player.inventory.find(i => i.id === itemId);
      if (!item) return state;
      
      return {
        ...state,
        ui: {
          ...state.ui,
          currentLog: [...state.ui.currentLog, { text: `You examine the ${item.name}. ${item.description}`, type: 'narrative' }]
        }
      };
    }
    case 'INITIAL_IMAGE_START':
      return {
        ...state,
        ui: {
          ...state.ui,
          isPollingImage: true
        }
      };
    case 'TOGGLE_UI_SETTING': {
      const key = typeof action.payload === 'object' ? action.payload.key : action.payload;
      const value = typeof action.payload === 'object' ? action.payload.value : !state.ui[action.payload as keyof typeof state.ui];
      return {
        ...state,
        ui: {
          ...state.ui,
          [key]: value
        }
      };
    }
    case 'SET_COMBAT_ANIMATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          combat_animation: action.payload
        }
      };
    case 'SET_TARGETED_PART':
      return {
        ...state,
        ui: {
          ...state.ui,
          targeted_part: action.payload
        }
      };
    case 'UPDATE_SETTING':
      return {
        ...state,
        ui: {
          ...state.ui,
          settings: {
            ...state.ui.settings,
            [action.payload.key]: action.payload.value
          }
        }
      };
    case 'TOGGLE_DIRECTOR_CUT':
      return {
        ...state,
        world: { ...state.world, director_cut: !state.world.director_cut }
      };
    case 'INJECT_DEVELOPER_JSON':
      try {
        const parsed = JSON.parse(action.payload);
        return { ...state, ...parsed };
      } catch (e) {
        console.error("Failed to inject JSON", e);
        return state;
      }
    case 'START_NEW_GAME':
      return {
        ...initialState,
        world: {
          ...initialState.world,
          director_cut: action.payload.directorCut || false
        }
      };
    case 'LOAD_GAME':
      return action.payload;
    case 'TOGGLE_MAGICKA_OVERCHARGE':
      return {
        ...state,
        player: {
          ...state.player,
          arcane: {
            ...state.player.arcane,
            magicka_overcharge: !state.player.arcane.magicka_overcharge
          }
        }
      };
    case 'CLEAR_STAT_DELTAS':
      return {
        ...state,
        ui: { ...state.ui, last_stat_deltas: null }
      };
    case 'HORDE_REQUEST_START':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            active: true,
            text_requests: action.payload.type === 'text' ? state.ui.horde_monitor.text_requests + 1 : state.ui.horde_monitor.text_requests,
            image_requests: action.payload.type === 'image' ? state.ui.horde_monitor.image_requests + 1 : state.ui.horde_monitor.image_requests
          }
        }
      };
    case 'HORDE_REQUEST_END':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            text_requests: action.payload.type === 'text' ? Math.max(0, state.ui.horde_monitor.text_requests - 1) : state.ui.horde_monitor.text_requests,
            image_requests: action.payload.type === 'image' ? Math.max(0, state.ui.horde_monitor.image_requests - 1) : state.ui.horde_monitor.image_requests,
            text_initial_eta: action.payload.type === 'text' && state.ui.horde_monitor.text_requests <= 1 ? 0 : state.ui.horde_monitor.text_initial_eta,
            image_initial_eta: action.payload.type === 'image' && state.ui.horde_monitor.image_requests <= 1 ? 0 : state.ui.horde_monitor.image_initial_eta,
            active: (state.ui.horde_monitor.text_requests + state.ui.horde_monitor.image_requests - 1) > 0
          }
        }
      };
    case 'HORDE_ETA_UPDATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            text_eta: action.payload.type === 'text' ? action.payload.eta : state.ui.horde_monitor.text_eta,
            image_eta: action.payload.type === 'image' ? action.payload.eta : state.ui.horde_monitor.image_eta,
            text_initial_eta: action.payload.type === 'text' && state.ui.horde_monitor.text_initial_eta === 0 ? action.payload.eta : state.ui.horde_monitor.text_initial_eta,
            image_initial_eta: action.payload.type === 'image' && state.ui.horde_monitor.image_initial_eta === 0 ? action.payload.eta : state.ui.horde_monitor.image_initial_eta
          }
        }
      };
    case 'UPDATE_GENERATION_CHANCE':
      return {
        ...state,
        ui: {
          ...state.ui,
          horde_monitor: {
            ...state.ui.horde_monitor,
            text_generation_chance: action.payload.text !== undefined ? action.payload.text : state.ui.horde_monitor.text_generation_chance,
            image_generation_chance: action.payload.image !== undefined ? action.payload.image : state.ui.horde_monitor.image_generation_chance
          }
        }
      };

    // ── Simulation engine ────────────────────────────────────────────────
    case 'SIM_TICK': {
      if (!state.sim_world) return state;
      const nextSimWorld: SimWorld = tickSimulation(state.sim_world);
      return { ...state, sim_world: nextSimWorld };
    }

    case 'SIM_HORDE_ENQUEUE': {
      const req = action.payload as HordeRequest;
      // Avoid duplicate requests for the same subject
      const alreadyQueued = state.horde_queue.some(
        r => r.subject_id === req.subject_id && r.type === req.type && r.status !== 'done' && r.status !== 'failed'
      );
      if (alreadyQueued) return state;
      return { ...state, horde_queue: [...state.horde_queue, req] };
    }

    case 'SIM_HORDE_UPDATE': {
      const updated = action.payload as HordeRequest;
      const queue = state.horde_queue.map(r => r.id === updated.id ? updated : r);
      // If done, store result in the NPC's dialogue_cache / backstory
      if (updated.status === 'done' && updated.result && state.sim_world) {
        const npcs = state.sim_world.npcs.map(npc => {
          if (npc.id !== updated.subject_id) return npc;
          if (updated.type === 'backstory') return { ...npc, backstory: updated.result };
          if (updated.type === 'dialogue') {
            return { ...npc, dialogue_cache: { ...npc.dialogue_cache, [updated.id]: updated.result! } };
          }
          return npc;
        });
        return {
          ...state,
          horde_queue: queue,
          sim_world: { ...state.sim_world, npcs },
        };
      }
      return { ...state, horde_queue: queue };
    }

    case 'SIM_ADD_MEMORY': {
      const { npcId, event, sentiment, subjectId } = action.payload;
      if (!state.sim_world) return state;
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const { addMemory } = require('../sim/MemorySystem');
        return { ...npc, memory: addMemory(npc, event, sentiment, subjectId, state.sim_world!.turn) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_INTERACTION': {
      const { npcId, targetId, outcome } = action.payload;
      if (!state.sim_world) return state;
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const { getRelationship, upsertRelationship, applyInteraction } = require('../sim/RelationshipSystem');
        const rel = getRelationship(npc, targetId);
        const updated = applyInteraction(rel, outcome, state.sim_world!.turn);
        return { ...npc, relationships: upsertRelationship(npc.relationships, updated) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_CORRUPTION': {
      const { npcId, amount } = action.payload;
      if (!state.sim_world) return state;
      const { applyCorruption } = require('../sim/CorruptionSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, corruption_state: applyCorruption(npc.corruption_state, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_STRESS': {
      const { npcId, amount } = action.payload;
      if (!state.sim_world) return state;
      const { applyStress } = require('../sim/CorruptionSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, corruption_state: applyStress(npc.corruption_state, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_APPLY_TRAUMA': {
      const { npcId, amount } = action.payload;
      if (!state.sim_world) return state;
      const { applyTrauma } = require('../sim/CorruptionSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, corruption_state: applyTrauma(npc.corruption_state, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_ADD_FAME': {
      const { npcId, fameType, amount } = action.payload;
      if (!state.sim_world) return state;
      const { addFame } = require('../sim/FameSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        return { ...npc, fame: addFame(npc.fame, fameType, amount) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_DAMAGE_CLOTHING': {
      const { npcId, slot, amount } = action.payload;
      if (!state.sim_world) return state;
      const { damageClothing } = require('../sim/ClothingSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const item = npc.clothing[slot as keyof typeof npc.clothing];
        if (!item) return npc;
        return { ...npc, clothing: { ...npc.clothing, [slot]: damageClothing(item, amount) } };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_ROMANTIC_INTERACTION': {
      const { npcId, targetId, outcome } = action.payload;
      if (!state.sim_world) return state;
      const { getRelationship, upsertRelationship } = require('../sim/RelationshipSystem');
      const { applyRomanticInteraction, defaultRomanceState } = require('../sim/RomanceSystem');
      const npcs = state.sim_world.npcs.map(npc => {
        if (npc.id !== npcId) return npc;
        const rel = getRelationship(npc, targetId);
        const romance = rel.romance ?? defaultRomanceState();
        const result = applyRomanticInteraction(romance, rel, outcome, state.sim_world!.turn);
        return { ...npc, relationships: upsertRelationship(npc.relationships, result.rel) };
      });
      return { ...state, sim_world: { ...state.sim_world, npcs } };
    }

    case 'SIM_START_COMBAT': {
      if (!state.sim_world) return state;
      const { attackerId, defenderId } = action.payload;
      const { createCombatEncounter } = require('../sim/CombatSystem');
      const combat = createCombatEncounter(attackerId, defenderId);
      return {
        ...state,
        sim_world: {
          ...state.sim_world,
          active_combats: [...(state.sim_world.active_combats ?? []), combat],
        },
      };
    }

    case 'SUMMARIZE_MEMORY': {
      const { summary, count } = action.payload;
      // Replace the oldest `count` entries with a single summary entry
      const trimmed = state.memory_graph.slice(count);
      return {
        ...state,
        memory_graph: [summary, ...trimmed],
      };
    }

    case 'BUY_ITEM': {
      const { item, cost } = action.payload as { item: any; cost: number };
      if (state.player.gold < cost) return state;
      const newItem = { ...item, id: `${item.id}-${Date.now()}` };
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - cost,
          inventory: [...state.player.inventory, newItem],
        },
      };
    }

    case 'SELL_ITEM': {
      const { itemId, price } = action.payload as { itemId: string; price: number };
      const itemIndex = state.player.inventory.findIndex(i => i.id === itemId);
      if (itemIndex === -1) return state;
      const soldItem = state.player.inventory[itemIndex];
      if (soldItem.is_equipped) return state; // Cannot sell equipped items
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold + price,
          inventory: state.player.inventory.filter(i => i.id !== itemId),
        },
      };
    }

    case 'REPAIR_ITEM': {
      const repairId = (action.payload as { itemId: string; cost: number }).itemId;
      const repairCost = (action.payload as { itemId: string; cost: number }).cost;
      if (state.player.gold < repairCost) return state;
      const repairedInventory = state.player.inventory.map(i =>
        i.id === repairId ? { ...i, integrity: i.max_integrity ?? 100 } : i
      );
      const repairedClothing = Object.fromEntries(
        Object.entries(state.player.clothing).map(([slot, equipped]) => [
          slot,
          equipped?.id === repairId ? { ...equipped, integrity: equipped.max_integrity ?? 100 } : equipped,
        ])
      ) as typeof state.player.clothing;
      const updated = withClothingState({
        ...state.player,
        gold: state.player.gold - repairCost,
        inventory: repairedInventory,
        clothing: repairedClothing,
      }).player;
      return {
        ...state,
        player: updated,
      };
    }

    case 'ADD_GOLD': {
      return {
        ...state,
        player: {
          ...state.player,
          gold: Math.max(0, state.player.gold + (action.payload as number)),
        },
      };
    }

    case 'ADD_FAME': {
      const { fame: fameAmt, notoriety: notAmt } = action.payload as { fame?: number; notoriety?: number };
      return {
        ...state,
        player: {
          ...state.player,
          fame: Math.max(0, Math.min(100, state.player.fame + (fameAmt ?? 0))),
          notoriety: Math.max(0, Math.min(100, state.player.notoriety + (notAmt ?? 0))),
        },
      };
    }

    // ── DoL-parity: Attitude system ───────────────────────────────────────
    case 'SET_ATTITUDE': {
      const { type, value } = action.payload as { type: keyof typeof state.player.attitudes; value: 'defiant' | 'submissive' | 'neutral' };
      return {
        ...state,
        player: {
          ...state.player,
          attitudes: { ...state.player.attitudes, [type]: value },
        },
      };
    }

    case 'UPDATE_ATTITUDES': {
      const allowedAttitudes = new Set(['defiant', 'submissive', 'neutral']);
      const updates = action.payload as Partial<typeof state.player.attitudes>;
      const nextAttitudes = { ...state.player.attitudes };

      for (const [key, value] of Object.entries(updates)) {
        if (key in nextAttitudes && typeof value === 'string' && allowedAttitudes.has(value)) {
          nextAttitudes[key as keyof typeof nextAttitudes] = value as typeof nextAttitudes[keyof typeof nextAttitudes];
        }
      }

      return {
        ...state,
        player: {
          ...state.player,
          attitudes: nextAttitudes,
        },
      };
    }

    // ── DoL-parity: Unlock feat ───────────────────────────────────────────
    case 'UNLOCK_FEAT': {
      const featId = action.payload as string;
      return {
        ...state,
        player: {
          ...state.player,
          feats: state.player.feats.map(f =>
            f.id === featId && !f.unlocked
              ? { ...f, unlocked: true, unlocked_on_day: state.world.day }
              : f
          ),
        },
      };
    }

    // ── DoL-parity: Add trait ─────────────────────────────────────────────
    case 'ADD_TRAIT': {
      const trait = action.payload as { id: string; name: string; description: string; effects: Record<string, number> };
      if (state.player.traits.some(t => t.id === trait.id)) return state;
      return {
        ...state,
        player: {
          ...state.player,
          traits: [...state.player.traits, trait],
        },
      };
    }

    // ── DoL-parity: Remove trait ──────────────────────────────────────────
    case 'REMOVE_TRAIT': {
      const traitId = action.payload as string;
      return {
        ...state,
        player: {
          ...state.player,
          traits: state.player.traits.filter(t => t.id !== traitId),
        },
      };
    }

    // ── DoL-parity: Update virginity ──────────────────────────────────────
    case 'LOSE_VIRGINITY': {
      const { type: virgType, description: virgDesc } = action.payload as { type: keyof typeof state.player.virginities; description: string };
      if (state.player.virginities[virgType] !== null) return state; // already lost
      return {
        ...state,
        player: {
          ...state.player,
          virginities: { ...state.player.virginities, [virgType]: virgDesc },
        },
      };
    }

    // ── DoL-parity: Pay Bailey ────────────────────────────────────────────
    case 'PAY_BAILEY': {
      const amount = action.payload as number;
      if (state.player.gold < amount) return state;
      const bp = { ...state.player.bailey_payment };
      bp.debt = Math.max(0, bp.debt - amount);
      if (bp.debt === 0) {
        bp.missed_payments = 0;
        bp.punishment_level = 0;
      }
      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - amount,
          bailey_payment: bp,
        },
      };
    }

    // ── DoL-parity: Update sexual skill ───────────────────────────────────
    case 'UPDATE_SEXUAL_SKILL': {
      const { skill, amount } = action.payload as { skill: keyof typeof state.player.sexual_skills; amount: number };
      return {
        ...state,
        player: {
          ...state.player,
          sexual_skills: {
            ...state.player.sexual_skills,
            [skill]: Math.max(0, Math.min(100, state.player.sexual_skills[skill] + amount)),
          },
        },
      };
    }

    // ── DoL-parity: Update insecurity ─────────────────────────────────────
    case 'UPDATE_INSECURITY': {
      const { part, amount: insAmt } = action.payload as { part: keyof typeof state.player.insecurity; amount: number };
      return {
        ...state,
        player: {
          ...state.player,
          insecurity: {
            ...state.player.insecurity,
            [part]: Math.max(0, Math.min(100, state.player.insecurity[part] + insAmt)),
          },
        },
      };
    }

    // ── DoL-parity: Update lewdity stats ──────────────────────────────────
    case 'UPDATE_LEWDITY_STATS': {
      const lewdityUpdates = action.payload as Partial<Record<keyof typeof state.player.lewdity_stats, number>>;
      const nextLewdity = { ...state.player.lewdity_stats };

      for (const [key, value] of Object.entries(lewdityUpdates)) {
        if (typeof value === 'number' && key in nextLewdity) {
          const statKey = key as keyof typeof nextLewdity;
          nextLewdity[statKey] = Math.max(0, Math.min(100, nextLewdity[statKey] + value));
        }
      }

      return {
        ...state,
        player: {
          ...state.player,
          lewdity_stats: nextLewdity,
        },
      };
    }

    // ── DoL-parity: Update sensitivity ────────────────────────────────────
    case 'UPDATE_SENSITIVITY': {
      const sensitivityUpdates = action.payload as Partial<Record<keyof typeof state.player.sensitivity, number>>;
      const nextSensitivity = { ...state.player.sensitivity };

      for (const [key, value] of Object.entries(sensitivityUpdates)) {
        if (typeof value === 'number' && key in nextSensitivity) {
          const partKey = key as keyof typeof nextSensitivity;
          nextSensitivity[partKey] = Math.max(0, Math.min(100, nextSensitivity[partKey] + value));
        }
      }

      return {
        ...state,
        player: {
          ...state.player,
          sensitivity: nextSensitivity,
        },
      };
    }

    // ── DoL-parity: Start pregnancy/incubation ───────────────────────────
    case 'START_INCUBATION': {
      const { type, days } = action.payload as { type: string; days: number };
      if (!state.ui.settings.enable_pregnancy) return state;
      if (state.player.biology.sterility) return state;

      // Check if already pregnant with this type
      if (state.player.biology.incubations.some(inc => inc.type === type)) return state;

      return {
        ...state,
        player: {
          ...state.player,
          biology: {
            ...state.player.biology,
            incubations: [
              ...state.player.biology.incubations,
              { type, progress: 0, days_remaining: days }
            ],
          },
        },
      };
    }

    // ── DoL-parity: Update body fluids ───────────────────────────────────
    case 'UPDATE_BODY_FLUIDS': {
      const fluidUpdates = action.payload as Partial<Record<keyof typeof state.player.body_fluids, number>>;
      const newBodyFluids = { ...state.player.body_fluids };

      for (const [key, value] of Object.entries(fluidUpdates)) {
        if (typeof value === 'number' && key in newBodyFluids) {
          const k = key as keyof typeof newBodyFluids;
          newBodyFluids[k] = Math.max(0, Math.min(100, newBodyFluids[k] + value));
        }
      }

      return {
        ...state,
        player: {
          ...state.player,
          body_fluids: newBodyFluids,
        },
      };
    }

    // ── DoL-parity: Update temperature ────────────────────────────────────
    case 'UPDATE_TEMPERATURE': {
      const updates = action.payload as Partial<typeof state.player.temperature>;
      const nextTemperature = { ...state.player.temperature };
      const allowedBodyTemps = new Set(['freezing', 'cold', 'chilly', 'comfortable', 'warm', 'hot', 'overheating']);

      if (typeof updates.ambient_temp === 'number') {
        nextTemperature.ambient_temp = Math.max(-20, Math.min(50, updates.ambient_temp));
      }
      if (typeof updates.clothing_warmth === 'number') {
        nextTemperature.clothing_warmth = Math.max(0, Math.min(100, updates.clothing_warmth));
      }
      if (typeof updates.body_temp === 'string' && allowedBodyTemps.has(updates.body_temp)) {
        nextTemperature.body_temp = updates.body_temp;
      }

      return {
        ...state,
        player: {
          ...state.player,
          temperature: nextTemperature,
        },
      };
    }

    // ── Quest System ──────────────────────────────────────────────────────
    case 'UPDATE_QUEST': {
      const { id: qId, updates } = action.payload as { id: string; updates: Partial<{ status: 'active' | 'completed' | 'failed' | 'locked'; objectives: any[] }> };
      const updatedQuests = state.player.quests.map(q =>
        q.id === qId ? { ...q, ...updates } as typeof q : q
      );
      return { ...state, player: { ...state.player, quests: updatedQuests } };
    }

    case 'COMPLETE_QUEST': {
      const { id: cqId } = action.payload as { id: string };
      const quest = state.player.quests.find(q => q.id === cqId);
      if (!quest || quest.status === 'completed') return state;

      let newGold = state.player.gold;
      let newFeats = [...state.player.feats];
      let newSkills = { ...state.player.skills };
      let newInventory = [...state.player.inventory];

      // Grant rewards
      if (quest.rewards) {
        if (quest.rewards.gold) newGold += quest.rewards.gold;
        if (quest.rewards.feats) {
          newFeats = newFeats.map(f =>
            quest.rewards!.feats!.includes(f.id) ? { ...f, unlocked: true, unlocked_on_day: state.world.day } : f
          );
        }
        if (quest.rewards.skills) {
          for (const [sk, val] of Object.entries(quest.rewards.skills)) {
            if (typeof val === 'number' && sk in newSkills) {
              newSkills[sk as keyof typeof newSkills] = Math.min(100, newSkills[sk as keyof typeof newSkills] + val);
            }
          }
        }
        if (quest.rewards.items) {
          for (const itemId of quest.rewards.items) {
            const built = buildResultItem(itemId);
            if (built) newInventory.push(built);
          }
        }
      }

      // Mark completed and unlock next chapter quests
      const completedQuests = state.player.quests.map(q =>
        q.id === cqId ? { ...q, status: 'completed' as const } : q
      );

      // Unlock quests whose prerequisites are now all met
      const completedIds = new Set(completedQuests.filter(q => q.status === 'completed').map(q => q.id));
      const existingIds = new Set(completedQuests.map(q => q.id));
      const toUnlock: typeof completedQuests = [];
      for (const candidate of Object.values(QUESTS)) {
        if (existingIds.has(candidate.id)) continue;
        if (!candidate.prerequisites || candidate.prerequisites.length === 0) continue;
        if (candidate.prerequisites.every(pid => completedIds.has(pid))) {
          toUnlock.push({ ...candidate, status: 'active' });
        }
      }

      return {
        ...state,
        player: {
          ...state.player,
          gold: newGold,
          feats: newFeats,
          skills: newSkills,
          inventory: newInventory,
          quests: [...completedQuests, ...toUnlock],
        },
        ui: {
          ...state.ui,
          currentLog: [
            ...state.ui.currentLog,
            { text: `Quest completed: "${quest.title}"`, type: 'system' as const },
          ],
        },
      };
    }

    // ── Recipe System ─────────────────────────────────────────────────────
    case 'ADD_RECIPE_TO_KNOWN': {
      const { recipeId } = action.payload as { recipeId: string };
      if (state.player.known_recipes.includes(recipeId)) return state;
      return { ...state, player: { ...state.player, known_recipes: [...state.player.known_recipes, recipeId] } };
    }

    case 'COOK_RECIPE': {
      const { recipeId: cookId } = action.payload as { recipeId: string };
      const recipe = RECIPES[cookId];
      if (!recipe) return state;
      if (!state.player.known_recipes.includes(cookId)) return state;
      if (state.player.skills.cooking < recipe.cooking_skill_required) {
        return {
          ...state,
          ui: {
            ...state.ui,
            currentLog: [...state.ui.currentLog, { text: `Your cooking skill (${state.player.skills.cooking}) is too low for "${recipe.name}" (requires ${recipe.cooking_skill_required}).`, type: 'system' as const }],
          },
        };
      }
      if (!canCookRecipe(recipe, state.player.inventory)) {
        return {
          ...state,
          ui: {
            ...state.ui,
            currentLog: [...state.ui.currentLog, { text: `You don't have the ingredients for "${recipe.name}".`, type: 'system' as const }],
          },
        };
      }

      // Remove ingredients (consume one stack per requirement)
      let cookInventory = [...state.player.inventory];
      for (const req of recipe.ingredients) {
        let remaining = req.quantity;
        cookInventory = cookInventory.filter(item => {
          if (item.id === req.item_id && remaining > 0) { remaining--; return false; }
          return true;
        });
      }

      // Add result
      for (let i = 0; i < recipe.result.quantity; i++) {
        const resultItem = buildResultItem(recipe.result.item_id);
        if (resultItem) cookInventory.push(resultItem);
      }

      const cookSkillGain = Math.max(1, Math.floor(recipe.cooking_skill_required / 5));
      return {
        ...state,
        player: {
          ...state.player,
          inventory: cookInventory,
          skills: {
            ...state.player.skills,
            cooking: Math.min(100, state.player.skills.cooking + cookSkillGain),
          },
        },
        ui: {
          ...state.ui,
          currentLog: [...state.ui.currentLog, { text: `You prepare "${recipe.name}". It smells wonderful.`, type: 'narrative' as const }],
        },
      };
    }

    // ── Foraging ──────────────────────────────────────────────────────────
    case 'FORAGE_RESOURCE': {
      const { location_id, action_id } = action.payload as { location_id: string; action_id: string };
      const loc = LOCATIONS[location_id];
      if (!loc) return state;
      const forage_action = (loc.actions as any[])?.find((a: any) => a.id === action_id);
      if (!forage_action) return state;

      // Skill check — use foraging skill with a pseudo-random result
      let success = true;
      if (forage_action.skill_check) {
        const { stat, difficulty } = forage_action.skill_check as { stat: string; difficulty: number };
        const skillVal: number =
          (state.player.skills as any)[stat] ??
          (state.player.stats as any)[stat] ??
          0;
        // 50% base chance, improved by skill relative to difficulty
        const chance = Math.min(95, Math.max(10, 50 + (skillVal - difficulty) * 0.8));
        success = Math.random() * 100 < chance;
      }

      const statDeltas: any = success ? (forage_action.stat_deltas ?? {}) : (forage_action.fail_stat_deltas ?? forage_action.stat_deltas ?? {});
      const skillDeltas: any = forage_action.skill_deltas ?? {};
      const rawItems: any[] = success ? (forage_action.new_items ?? []) : [];

      const forageStats = { ...state.player.stats };
      for (const [k, v] of Object.entries(statDeltas)) {
        if (typeof v === 'number' && k in forageStats) {
          const sk = k as StatKey;
          const cap = (forageStats as any)[`max_${sk}`] ?? 100;
          forageStats[sk] = Math.max(0, Math.min(cap, forageStats[sk] + v));
        }
      }

      const forageSkills = { ...state.player.skills };
      for (const [k, v] of Object.entries(skillDeltas)) {
        if (typeof v === 'number' && k in forageSkills) {
          forageSkills[k as keyof typeof forageSkills] = Math.max(0, Math.min(100, forageSkills[k as keyof typeof forageSkills] + (v as number)));
        }
      }

      const forageInventory = [...state.player.inventory];
      for (const raw of rawItems) {
        forageInventory.push({
          id: raw.id ?? `foraged_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: raw.name ?? 'Unknown Item',
          type: raw.type ?? 'misc',
          rarity: raw.rarity ?? 'common',
          description: raw.description ?? '',
          value: raw.value ?? 1,
          weight: raw.weight ?? 0.1,
          ...(raw.stats ? { stats: raw.stats } : {}),
        });
      }

      const forageLog = success
        ? (forage_action.outcome ?? 'You gather some resources.')
        : (forage_action.fail_outcome ?? 'You find nothing useful.');

      return {
        ...state,
        player: {
          ...state.player,
          stats: forageStats,
          skills: forageSkills,
          inventory: forageInventory,
        },
        ui: {
          ...state.ui,
          currentLog: [...state.ui.currentLog, { text: forageLog, type: 'narrative' as const }],
        },
      };
    }

    // ── DoL-parity: Event flags ───────────────────────────────────────────
    case 'SET_EVENT_FLAG': {
      const { flag, value: flagValue = true } = action.payload as { flag: string; value?: boolean | number };
      return {
        ...state,
        world: {
          ...state.world,
          event_flags: { ...state.world.event_flags, [flag]: flagValue },
        },
      };
    }

    case 'CLEAR_EVENT_FLAG': {
      const { flag: clearFlag } = action.payload as { flag: string };
      const nextFlags = { ...state.world.event_flags };
      delete nextFlags[clearFlag];
      return {
        ...state,
        world: { ...state.world, event_flags: nextFlags },
      };
    }

    // ── DoL-parity: NPC Relationships ─────────────────────────────────────
    case 'UPDATE_NPC_RELATIONSHIP': {
      const { npc_id, deltas } = action.payload as {
        npc_id: string;
        deltas: Partial<{ trust: number; love: number; fear: number; dom: number; sub: number }>;
      };

      const existing = state.world.npc_relationships[npc_id] ?? {
        npc_id,
        trust: 0,
        love: 0,
        fear: 0,
        dom: 0,
        sub: 0,
        milestone: 'stranger' as const,
        met_on_day: state.world.day,
        last_interaction_day: state.world.day,
        interaction_count: 0,
        scene_flags: {},
      };

      const updated = { ...existing };
      const numericKeys = new Set<string>(['trust', 'love', 'fear', 'dom', 'sub']);
      for (const [k, v] of Object.entries(deltas)) {
        if (typeof v === 'number' && numericKeys.has(k) && k in updated) {
          const key = k as 'trust' | 'love' | 'fear' | 'dom' | 'sub';
          updated[key] = Math.max(0, Math.min(100, existing[key] + v));
        }
      }

      // Derive milestone from combined relationship stats
      const total = updated.trust + updated.love;
      updated.milestone =
        total >= 180 ? 'bonded' :
        total >= 140 ? 'lover' :
        total >= 100 ? 'close' :
        total >= 60  ? 'friend' :
        total >= 20  ? 'acquaintance' :
        'stranger';

      return {
        ...state,
        world: {
          ...state.world,
          npc_relationships: { ...state.world.npc_relationships, [npc_id]: updated },
        },
      };
    }

    case 'SET_NPC_SCENE_FLAG': {
      const { npc_id: sfNpc, flag: sfFlag, value: sfValue = true } = action.payload as {
        npc_id: string;
        flag: string;
        value?: boolean | number;
      };
      const sfExisting = state.world.npc_relationships[sfNpc] ?? {
        npc_id: sfNpc,
        trust: 0, love: 0, fear: 0, dom: 0, sub: 0,
        milestone: 'stranger' as const,
        met_on_day: state.world.day,
        last_interaction_day: state.world.day,
        interaction_count: 0,
        scene_flags: {},
      };
      return {
        ...state,
        world: {
          ...state.world,
          npc_relationships: {
            ...state.world.npc_relationships,
            [sfNpc]: { ...sfExisting, scene_flags: { ...sfExisting.scene_flags, [sfFlag]: sfValue } },
          },
        },
      };
    }

    // ── Phase 5: Stateful NPC interaction via relationshipEngine ─────────────
    case 'RESOLVE_NPC_INTERACTION': {
      const { npc_id: riNpc, intent: riIntent } = action.payload as { npc_id: string; intent: string };
      const riExisting = state.world.npc_relationships[riNpc] ?? {
        npc_id: riNpc,
        trust: 0, love: 0, fear: 0, dom: 0, sub: 0,
        milestone: 'stranger' as const,
        met_on_day: state.world.day,
        last_interaction_day: 0,
        interaction_count: 0,
        scene_flags: {},
      };
      const { updated_relationship } = resolveRelationshipInteraction(
        riExisting,
        riIntent,
        state.world.day,
      );
      return {
        ...state,
        world: {
          ...state.world,
          npc_relationships: {
            ...state.world.npc_relationships,
            [riNpc]: updated_relationship,
          },
        },
      };
    }

    // ── DoL-parity: Time advancement ──────────────────────────────────────
    case 'ADVANCE_TIME': {
      const { hours } = action.payload as { hours: number };
      const totalHours = state.world.hour + hours;
      const newHour = totalHours % 24;
      const daysElapsed = Math.floor(totalHours / 24);
      const newDay = state.world.day + daysElapsed;
      const { clothing_state } = withClothingState(state.player);
      let notoriety = state.player.notoriety;
      let newLewdity = { ...state.player.lewdity_stats };

      // Life sim needs drain per hour
      const drainRate = state.ui.settings.stat_drain_multiplier;
      const newNeeds = { ...state.player.life_sim.needs };
      newNeeds.hunger   = Math.max(0, newNeeds.hunger   - 2 * hours * drainRate);
      newNeeds.thirst   = Math.max(0, newNeeds.thirst   - 3 * hours * drainRate);
      newNeeds.energy   = Math.max(0, newNeeds.energy   - 1 * hours * drainRate);
      newNeeds.hygiene  = Math.max(0, newNeeds.hygiene  - 1 * hours * drainRate);
      newNeeds.social   = Math.max(0, newNeeds.social   - 0.5 * hours * drainRate);

      // Stat drains
      const newStats = { ...state.player.stats };
      newStats.hygiene = Math.max(0, Math.min(100, newStats.hygiene - hours * drainRate));
      newStats.stress  = Math.max(0, Math.min(100, newStats.stress + (hours > 4 ? 2 * drainRate : 0)));

      // Bailey payment: add debt each missed payment day
      let newBailey = { ...state.player.bailey_payment };
      if (daysElapsed > 0) {
        for (let d = 1; d <= daysElapsed; d++) {
          const checkDay = state.world.day + d;
          if (checkDay > 0 && ((checkDay - 1) % 7) === newBailey.due_day) {
            newBailey = {
              ...newBailey,
              debt: newBailey.debt + newBailey.weekly_amount,
              missed_payments: newBailey.missed_payments + 1,
              punishment_level: Math.min(3, Math.floor((newBailey.missed_payments + 1) / 2)),
            };
          }
        }
      }

      // Incubation tick
      const dayFraction = hours / 24;
      const newBiology = {
        ...state.player.biology,
        cycle_day: daysElapsed > 0
          ? ((state.player.biology.cycle_day + daysElapsed - 1) % 28) + 1
          : state.player.biology.cycle_day,
        incubations: state.player.biology.incubations
          .map(inc => ({
            ...inc,
            days_remaining: Math.max(0, inc.days_remaining - dayFraction),
            progress: inc.days_remaining > 0
              ? Math.min(1, inc.progress + dayFraction / inc.days_remaining)
              : 1,
          }))
          .filter(inc => inc.days_remaining > 0),
      };

      // Recalculate body temperature
      const clothingWarmth = clothing_state.summary.warmth;
      const effectiveTemp = state.player.temperature.ambient_temp + clothingWarmth * 0.3;
      const body_temp: typeof state.player.temperature.body_temp =
        effectiveTemp < -10 ? 'freezing' :
        effectiveTemp < 0   ? 'cold' :
        effectiveTemp < 8   ? 'chilly' :
        effectiveTemp < 20  ? 'comfortable' :
        effectiveTemp < 28  ? 'warm' :
        effectiveTemp < 35  ? 'hot' : 'overheating';

      const exposureImpact = exposureConsequences(clothing_state, hours);
      newStats.stress = clamp(newStats.stress + exposureImpact.stress, 0, 100);
      newStats.hygiene = clamp(newStats.hygiene - exposureImpact.hygiene, 0, 100);
      newStats.allure = clamp(newStats.allure + exposureImpact.allure, 0, 100);
      newLewdity = { ...newLewdity, exhibitionism: clamp(newLewdity.exhibitionism + exposureImpact.exhibitionism, 0, 100) };
      notoriety = clamp(notoriety + exposureImpact.notoriety, 0, 100);

      return {
        ...state,
        world: {
          ...state.world,
          day: newDay,
          hour: newHour,
          week_day: advanceWeekDay(state.world.week_day ?? 0 /* legacy saves default to Monday */, daysElapsed),
          // Apply NPC trust deltas from daily stat tick
          npc_relationships: daysElapsed > 0
            ? (() => {
                const dailyDeltas = computeDailyStatDeltas(state, daysElapsed);
                const updated = { ...state.world.npc_relationships };
                for (const [npcId, delta] of Object.entries(dailyDeltas.npc_trust_deltas)) {
                  if (updated[npcId]) {
                    updated[npcId] = {
                      ...updated[npcId],
                      trust: Math.max(0, Math.min(100, updated[npcId].trust + delta)),
                    };
                  }
                }
                return updated;
              })()
            : state.world.npc_relationships,
        },
        player: {
          ...state.player,
          stats: (() => {
            if (daysElapsed <= 0) return newStats;
            const dailyDeltas = computeDailyStatDeltas(state, daysElapsed);
            const s = { ...newStats };
            for (const [key, delta] of Object.entries(dailyDeltas.stats)) {
              const k = key as StatKey;
              if (typeof s[k] === 'number') {
                (s as any)[k] = Math.max(0, Math.min(100, (s[k] as number) + (delta ?? 0)));
              }
            }
            return s;
          })(),
          clothing_state,
          gold: daysElapsed > 0
            ? state.player.gold + computeDailyStatDeltas(state, daysElapsed).gold_earned
            : state.player.gold,
          notoriety,
          lewdity_stats: newLewdity,
          bailey_payment: newBailey,
          biology: newBiology,
          temperature: { ...state.player.temperature, clothing_warmth: clothingWarmth, body_temp },
          life_sim: { ...state.player.life_sim, needs: newNeeds },
        },
      };
    }

    // ── DoL-parity: Clothing damage ───────────────────────────────────────
    case 'DAMAGE_CLOTHING': {
      const { item_id, amount: dmgAmt } = action.payload as { item_id: string; amount: number };
      const damagedInventory = state.player.inventory.map(item =>
        item.id === item_id && typeof item.integrity === 'number'
          ? { ...item, integrity: Math.max(0, item.integrity - dmgAmt) }
          : item
      );
      const damagedClothing = Object.fromEntries(
        Object.entries(state.player.clothing).map(([slot, equipped]) => [
          slot,
          equipped?.id === item_id && typeof equipped.integrity === 'number'
            ? { ...equipped, integrity: Math.max(0, equipped.integrity - dmgAmt) }
            : equipped,
        ])
      ) as typeof state.player.clothing;

      const updated = withClothingState({
        ...state.player,
        inventory: damagedInventory,
        clothing: damagedClothing,
      }).player;

      return {
        ...state,
        player: updated,
      };
    }

    // ── DoL-parity: Justice / Crime ───────────────────────────────────────
    case 'ADD_JUSTICE_BOUNTY': {
      const { amount: bountyAmt, suspicion: suspAmt = 0 } = action.payload as { amount: number; suspicion?: number };
      const j = state.player.justice;
      return {
        ...state,
        player: {
          ...state.player,
          justice: {
            ...j,
            bounty: j.bounty + bountyAmt,
            suspicion: Math.max(0, Math.min(100, j.suspicion + suspAmt)),
          },
        },
      };
    }

    case 'CLEAR_JUSTICE_BOUNTY': {
      return {
        ...state,
        player: {
          ...state.player,
          justice: { ...state.player.justice, bounty: 0, suspicion: 0, jail_sentence: 0 },
        },
      };
    }

    // ── Base Upgrades ─────────────────────────────────────────────────────
    case 'UPGRADE_BASE': {      const { upgrade, cost } = action.payload as { upgrade: string; cost: number };
      if (state.player.gold < cost) {
        return {
          ...state,
          ui: {
            ...state.ui,
            currentLog: [...state.ui.currentLog, { text: "You don't have enough gold for that upgrade.", type: 'system' as const }],
          },
        };
      }

      const upgradeMap: Record<string, Partial<typeof state.player.base>> = {
        'bed':              { bed_tier: Math.min(3, ((state.player.base.bed_tier ?? 0) as number) + 1) },
        'security':         { security_tier: Math.min(3, ((state.player.base.security_tier ?? 0) as number) + 1) },
        'alchemy_station':  { alchemy_station: true },
        'bathhouse':        { bathhouse: true },
        'library':          { library: true },
        'shrine':           { shrine: true },
      };

      const baseUpdate = upgradeMap[upgrade];
      if (!baseUpdate) return state;

      return {
        ...state,
        player: {
          ...state.player,
          gold: state.player.gold - cost,
          base: { ...state.player.base, ...baseUpdate },
        },
        ui: {
          ...state.ui,
          currentLog: [...state.ui.currentLog, { text: `You upgrade your base: ${upgrade}.`, type: 'system' as const }],
        },
      };
    }

    case 'ADD_FACTION_REP': {
      const { faction_id, delta } = action.payload as { faction_id: string; delta: number };
      const currentFactions = state.sim_world?.factions ?? defaultFactions();
      const updatedFactions = applyRepWithRivalSpillover(currentFactions, faction_id as import('../sim/types').FactionId, delta);
      return {
        ...state,
        sim_world: state.sim_world ? { ...state.sim_world, factions: updatedFactions } : state.sim_world,
      };
    }

    case 'COMMIT_CRIME': {
      const { crime_type, faction_id, witnessed } = action.payload as {
        crime_type: string;
        faction_id: string;
        witnessed: boolean;
      };
      const currentFactions = state.sim_world?.factions ?? defaultFactions();
      const currentRecord = (state.sim_world?.criminal_records ?? {})['player'] ?? defaultCriminalRecord();
      const turn = state.sim_world?.turn ?? 0;
      const { record, factions } = processCrimeEvent(
        currentRecord,
        currentFactions,
        crime_type as import('../sim/types').CrimeType,
        faction_id as import('../sim/types').FactionId,
        turn,
        witnessed,
      );
      const logText = witnessed
        ? `You were seen committing ${crime_type}. Bounty increased.`
        : `You committed ${crime_type} undetected.`;
      return {
        ...state,
        sim_world: state.sim_world
          ? {
              ...state.sim_world,
              factions,
              criminal_records: { ...state.sim_world.criminal_records, player: record },
            }
          : state.sim_world,
        ui: {
          ...state.ui,
          currentLog: [...state.ui.currentLog, { text: logText, type: 'system' as const }],
        },
      };
    }

    case 'RESOLVE_ARREST': {
      const { resolution, faction_id } = action.payload as {
        resolution: 'pay_bounty' | 'serve_sentence';
        faction_id: string;
      };
      const currentFactions = state.sim_world?.factions ?? defaultFactions();
      const currentRecord = (state.sim_world?.criminal_records ?? {})['player'] ?? defaultCriminalRecord();
      const fid = faction_id as import('../sim/types').FactionId;

      if (resolution === 'pay_bounty') {
        const { record, factions, gold_paid } = processPayBounty(currentRecord, currentFactions, fid);
        if (state.player.gold < gold_paid) {
          return {
            ...state,
            ui: {
              ...state.ui,
              currentLog: [...state.ui.currentLog, { text: `You cannot afford the ${gold_paid}g bounty.`, type: 'system' as const }],
            },
          };
        }
        return {
          ...state,
          player: { ...state.player, gold: state.player.gold - gold_paid },
          sim_world: state.sim_world
            ? { ...state.sim_world, factions, criminal_records: { ...state.sim_world.criminal_records, player: record } }
            : state.sim_world,
          ui: {
            ...state.ui,
            currentLog: [...state.ui.currentLog, { text: `Bounty paid: ${gold_paid}g. Record cleared with ${faction_id}.`, type: 'system' as const }],
          },
        };
      } else {
        const { record, factions } = processServeSentence(currentRecord, currentFactions, fid);
        return {
          ...state,
          sim_world: state.sim_world
            ? { ...state.sim_world, factions, criminal_records: { ...state.sim_world.criminal_records, player: record } }
            : state.sim_world,
          ui: {
            ...state.ui,
            currentLog: [...state.ui.currentLog, { text: `You served your sentence. Record cleared with ${faction_id}.`, type: 'system' as const }],
          },
        };
      }
    }

    default:
      return state;
  }
}
