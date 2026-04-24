import { GameState, StatKey } from '../types';
import { generateId } from '../utils/crypto';
import { LOCATIONS } from '../data/locations';
import { initialState } from '../state/initialState';
import { advanceWeekDay } from '../utils/scheduleEngine';
import { computeClothingState } from '../utils/clothingState';
import { tickPlayerNeeds } from '../sim/NeedsSystem';

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function withClothingState(player: GameState['player'], forceWarmth?: number, forceBodyTemp?: string) {
  const cs = computeClothingState(player.clothing, player.clothing_state);
  const w = forceWarmth !== undefined ? clamp(forceWarmth) : cs.summary.warmth;
  const amb = player.temperature.ambient_temp;
  let bt = forceBodyTemp || 'comfortable';
  if (!forceBodyTemp) {
    const effective = amb + (w / 4); 
    if (effective < 15) bt = 'chilly';
    if (effective < 10) bt = 'cold'; 
    if (effective < -5) bt = 'freezing';
    if (effective > 30) bt = 'warm';
    if (effective > 45) bt = 'hot';
    if (amb < -10) bt = 'freezing';
  }
  return { ...player, clothing_state: cs, temperature: { ...player.temperature, clothing_warmth: w, body_temp: bt as any } };
}

export function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {
    case 'START_NEW_GAME': return { ...initialState, world: { ...initialState.world, director_cut: true } };
    case 'LOAD_GAME': return action.payload;
    case 'SET_PLAYER_AVATAR': return { ...state, player: { ...state.player, avatar_url: action.payload } };
    case 'START_TURN': return { ...state, world: { ...state.world, last_intent: action.payload.intent || null }, ui: { ...state.ui, isPollingText: true, currentLog: [...state.ui.currentLog, { text: `> ${action.payload.actionText}`, type: 'action' }] } };
    case 'EQUIP_ITEM': {
      const i = state.player.inventory.find(x => x.id === action.payload.itemId); if (!i || i.type !== 'clothing') return state;
      const inv = state.player.inventory.map(x => x.id === action.payload.itemId ? { ...x, is_equipped: true } : x);
      const clo = { ...state.player.clothing, [i.slot as string]: i };
      return { ...state, player: { ...withClothingState({ ...state.player, inventory: inv, clothing: clo }), clothing: clo } };
    }
    case 'USE_ITEM': {
      const i = state.player.inventory.find(x => x.id === action.payload.itemId); if (!i) return state;
      let s = { ...state.player.stats }; if (i.id === 'healing-poultice' || i.stats?.health) s.health = clamp(s.health + 25);
      return { ...state, player: { ...state.player, stats: s, inventory: state.player.inventory.filter(x => x.id !== action.payload.itemId) } };
    }
    case 'BUY_ITEM': return state.player.gold < action.payload.cost ? state : { ...state, player: { ...state.player, gold: state.player.gold - action.payload.cost, inventory: [...state.player.inventory, action.payload.item] } };
    case 'SELL_ITEM': {
      const i = state.player.inventory.find(x => x.id === action.payload.itemId);
      if (!i || i.is_equipped) return state;
      return { ...state, player: { ...state.player, gold: state.player.gold + action.payload.price, inventory: state.player.inventory.filter(x => x.id !== action.payload.itemId) } };
    }
    case 'REPAIR_ITEM': return state.player.gold < action.payload.cost ? state : { ...state, player: { ...state.player, gold: state.player.gold - action.payload.cost, inventory: state.player.inventory.map(x => x.id === action.payload.itemId ? { ...x, integrity: x.max_integrity || 100 } : x) } };
    case 'DAMAGE_CLOTHING': {
      const i = state.player.inventory.find(x => x.id === action.payload.item_id); if (!i) return state;
      const u = { ...i, integrity: clamp((i.integrity ?? 100) - action.payload.amount, 0, 100) };
      const ni = state.player.inventory.map(x => x.id === i.id ? u : x);
      let nc = { ...state.player.clothing }; if (i.slot) { const s = i.slot as keyof typeof nc; if (nc[s]?.id === i.id) nc[s] = u as any; }
      return { ...state, player: withClothingState({ ...state.player, inventory: ni, clothing: nc }) };
    }
    case 'ADD_GOLD': {
      if (action.payload === 0) return state;
      return { ...state, player: { ...state.player, gold: state.player.gold + action.payload } };
    }
    case 'ADD_FAME': {
      const { fame = 0, notoriety = 0 } = action.payload;
      const nextFame = clamp(state.player.fame + fame);
      const nextNotoriety = clamp(state.player.notoriety + notoriety);
      if (nextFame === state.player.fame && nextNotoriety === state.player.notoriety) return state;
      return { ...state, player: { ...state.player, fame: nextFame, notoriety: nextNotoriety } };
    }
    case 'SET_ATTITUDE': {
      if (state.player.attitudes[action.payload.type as keyof typeof state.player.attitudes] === action.payload.value) return state;
      return { ...state, player: { ...state.player, attitudes: { ...state.player.attitudes, [action.payload.type]: action.payload.value } } };
    }
    case 'UPDATE_ATTITUDES': {
      const next = { ...state.player.attitudes, ...action.payload };
      if (Object.keys(action.payload).every(k => (state.player.attitudes as any)[k] === (next as any)[k])) return state;
      return { ...state, player: { ...state.player, attitudes: next } };
    }
    case 'ADD_TRAIT': return state.player.traits.some(t => t.id === action.payload.id) ? state : { ...state, player: { ...state.player, traits: [...state.player.traits, action.payload] } };
    case 'REMOVE_TRAIT': return { ...state, player: { ...state.player, traits: state.player.traits.filter(t => t.id !== action.payload) } };
    case 'LOSE_VIRGINITY': return state.player.virginities[action.payload.type as keyof typeof state.player.virginities] ? state : { ...state, player: { ...state.player, virginities: { ...state.player.virginities, [action.payload.type]: action.payload.description } } };
    case 'PAY_BAILEY': return state.player.gold < action.payload ? state : { ...state, player: { ...state.player, gold: state.player.gold - action.payload, bailey_payment: { ...state.player.bailey_payment, debt: 0, missed_payments: 0, punishment_level: 0 } } };
    case 'UNLOCK_FEAT': return state.player.feats.find(f => f.id === action.payload)?.unlocked ? state : { ...state, player: { ...state.player, feats: state.player.feats.map(f => f.id === action.payload ? { ...f, unlocked: true, unlocked_on_day: state.world.day } : f) } };
    case 'SET_EVENT_FLAG': {
      const val = action.payload.value ?? true;
      if (state.world.event_flags[action.payload.flag] === val) return state;
      return { ...state, world: { ...state.world, event_flags: { ...state.world.event_flags, [action.payload.flag]: val } } };
    }
    case 'CLEAR_EVENT_FLAG': { const f = { ...state.world.event_flags }; delete f[action.payload.flag]; return { ...state, world: { ...state.world, event_flags: f } }; }
    case 'UPDATE_NPC_RELATIONSHIP': {
      const { npc_id, deltas } = action.payload;
      const c = state.world.npc_relationships[npc_id] || { trust: 0, love: 0, fear: 0, dom: 0, scene_flags: {} };
      const u = { ...c, trust: clamp(c.trust + (deltas.trust || 0)), love: clamp(c.love + (deltas.love || 0)), fear: clamp(c.fear + (deltas.fear || 0)), dom: clamp(c.dom + (deltas.dom || 0)) };
      if (!u.milestone && u.trust >= 20) u.milestone = 'acquaintance';
      if (u.trust >= 80) u.milestone = 'bonded';
      if (u.trust === c.trust && u.love === c.love && u.fear === c.fear && u.dom === c.dom && u.milestone === c.milestone) return state;
      return { ...state, world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, [npc_id]: u } } };
    }
    case 'SET_NPC_SCENE_FLAG': {
      const { npc_id, flag, value } = action.payload;
      const c = state.world.npc_relationships[npc_id] || { trust: 0, love: 0, fear: 0, dom: 0, scene_flags: {} };
      if (c.scene_flags[flag] === value) return state;
      return { ...state, world: { ...state.world, npc_relationships: { ...state.world.npc_relationships, [npc_id]: { ...c, scene_flags: { ...c.scene_flags, [flag]: value } } } } };
    }
    case 'UPDATE_SEXUAL_SKILL': {
      const { skill, amount } = action.payload;
      const current = state.player.sexual_skills[skill as keyof typeof state.player.sexual_skills];
      const next = clamp(current + amount);
      if (current === next) return state;
      return { ...state, player: { ...state.player, sexual_skills: { ...state.player.sexual_skills, [skill]: next } } };
    }
    case 'UPDATE_INSECURITY': {
      const { part, amount } = action.payload;
      const current = state.player.insecurity[part as keyof typeof state.player.insecurity];
      const next = clamp(current + amount);
      if (current === next) return state;
      return { ...state, player: { ...state.player, insecurity: { ...state.player.insecurity, [part]: next } } };
    }
    case 'UPDATE_LEWDITY_STATS': {
      const u = action.payload; const c = state.player.lewdity_stats;
      const next = {
        exhibitionism: clamp(c.exhibitionism + (u.exhibitionism || 0)),
        promiscuity: clamp(c.promiscuity + (u.promiscuity || 0)),
        deviancy: clamp(c.deviancy + (u.deviancy || 0)),
        masochism: clamp(c.masochism + (u.masochism || 0))
      };
      if (next.exhibitionism === c.exhibitionism && next.promiscuity === c.promiscuity && next.deviancy === c.deviancy && next.masochism === c.masochism) return state;
      return { ...state, player: { ...state.player, lewdity_stats: next } };
    }
    case 'UPDATE_SENSITIVITY': {
      let changed = false;
      const s2 = { ...state.player.sensitivity };
      for (const [k, v] of Object.entries(action.payload)) {
        if (k in s2) {
          const current = (s2 as any)[k];
          const next = clamp(current + (v as number));
          if (current !== next) {
            (s2 as any)[k] = next;
            changed = true;
          }
        }
      }
      return changed ? { ...state, player: { ...state.player, sensitivity: s2 } } : state;
    }
    case 'UPDATE_TEMPERATURE': {
      const { ambient_temp, clothing_warmth, body_temp } = action.payload;
      const nt = { ...state.player.temperature, ambient_temp: ambient_temp !== undefined ? clamp(ambient_temp, -50, 50) : state.player.temperature.ambient_temp, clothing_warmth: clothing_warmth !== undefined ? clamp(clothing_warmth) : state.player.temperature.clothing_warmth, body_temp: body_temp ?? state.player.temperature.body_temp };
      return { ...state, player: withClothingState({ ...state.player, temperature: nt }, clothing_warmth, body_temp) };
    }
    case 'ADVANCE_TIME': {
      const h = action.payload.hours; const n = tickPlayerNeeds(state, h); let ns = { ...state.player.stats }; let nh = state.world.hour + h, nd = state.world.day; while (nh >= 24) { nh -= 24; nd += 1; }
      let bp = { ...state.player.bailey_payment }; if (nd > state.world.day) bp.debt += (nd - state.world.day) * 10;
      return { ...state, world: { ...state.world, hour: nh, day: nd, week_day: advanceWeekDay(state.world.week_day, nd - state.world.day) }, player: withClothingState({ ...state.player, stats: ns, life_sim: { ...state.player.life_sim, needs: n }, bailey_payment: bp }) };
    }
    case 'ADD_JUSTICE_BOUNTY': {
      const { amount, suspicion } = action.payload;
      const nextSuspicion = clamp(state.player.justice.suspicion + suspicion);
      if (amount === 0 && nextSuspicion === state.player.justice.suspicion) return state;
      return { ...state, player: { ...state.player, justice: { ...state.player.justice, bounty: state.player.justice.bounty + amount, suspicion: nextSuspicion } } };
    }
    case 'CLEAR_JUSTICE_BOUNTY': return { ...state, player: { ...state.player, justice: { ...state.player.justice, bounty: 0, suspicion: 0, jail_sentence: 0 } } };
    case 'RESOLVE_TEXT': {
      const { parsedText, actionText } = action.payload; if (!parsedText) return { ...state, ui: { ...state.ui, isPollingText: false } };
      const h = parsedText.hours_passed || 0; let nl = [...state.ui.currentLog]; if (parsedText.narrative_text) nl.push({ text: parsedText.narrative_text, type: 'narrative' });
      let ns = { ...state.player.stats }; if (parsedText.stat_deltas) { for (const [k, v] of Object.entries(parsedText.stat_deltas)) { if (k in ns) ns[k as StatKey] = clamp(ns[k as StatKey] + (v as number)); } }
      let nsk = { ...state.player.skills }; if (parsedText.skill_deltas) { for (const [k, v] of Object.entries(parsedText.skill_deltas)) { if (k in nsk) nsk[k as keyof typeof nsk] = clamp(nsk[k as keyof typeof nsk] + (v as number)); } }
      const n = tickPlayerNeeds(state, h); 
      const act = actionText?.toLowerCase() || '';
      if (state.world.last_intent === 'work') { n.hunger = clamp(n.hunger - 10 * h); n.energy = clamp(n.energy - 10 * h); }
      if (act.includes('sleep')) n.energy = clamp(n.energy + 80);
      if (act.includes('wash') || act.includes('bath')) n.hygiene = clamp(n.hygiene + 80);
      if (n.hunger <= 20) { ns.health = clamp(ns.health - 2 * h); ns.stamina = clamp(ns.stamina - 3 * h); }
      if (n.thirst <= 20) { ns.health = clamp(ns.health - 5 * h); }
      let ni = [...state.player.inventory]; let g = state.player.gold;
      if (parsedText.new_items) { parsedText.new_items.forEach((item: any) => { if (item.name === 'Gold Coin') g += item.value || 1; else ni.push({ ...item, id: item.id || generateId(), type: item.type || 'misc', weight: item.weight ?? 0.1, value: item.value ?? 1, integrity: item.integrity ?? 100 }); }); }
      if (typeof parsedText.equipment_integrity_delta === 'number') { ni = ni.map(i => i.is_equipped ? { ...i, integrity: clamp((i.integrity ?? 100) + parsedText.equipment_integrity_delta) } : i); }
      let na = { ...state.player.anatomy }; if (parsedText.combat_injury) { na.injuries = [...na.injuries, parsedText.combat_injury]; ns.health = clamp(ns.health - (parsedText.combat_injury.health_penalty || 0)); ns.stamina = clamp(ns.stamina - (parsedText.combat_injury.stamina_penalty || 0)); }
      let af = [...state.player.afflictions]; if (parsedText.new_affliction) { if (!af.includes(parsedText.new_affliction)) af.push(parsedText.new_affliction); }
      let q = [...state.player.quests]; if (parsedText.new_quests) parsedText.new_quests.forEach((nq: any) => { if (!q.some(x => x.id === nq.id)) q.push({ ...nq, status: 'active' }); }); if (parsedText.completed_quests) parsedText.completed_quests.forEach((id: string) => { q = q.map(x => x.id === id ? { ...x, status: 'completed' } : x); });
      let ls = { ...state.player.lewdity_stats }; if (parsedText.stat_deltas?.purity < 0) ls.exhibitionism = clamp(ls.exhibitionism + Math.abs(parsedText.stat_deltas.purity) * 0.15);
      let nh = state.world.hour + h, nd = state.world.day; while (nh >= 24) { nh -= 24; nd += 1; }
      let tp = { ...state.player.temperature }; if (state.world.weather === 'Blizzard') { ns.stamina = clamp(ns.stamina - 10 * h); tp.ambient_temp = -15; } if (state.world.weather === 'Thunderstorm' || state.world.weather === 'Scorching') ns.stress = clamp(ns.stress + 10 * h); if (state.world.weather === 'Scorching') tp.ambient_temp = 38;
      let mg = [...state.memory_graph]; if (parsedText.memory_entry) mg.push(parsedText.memory_entry); else if (parsedText.narrative_text) mg.push(`Day ${state.world.day}: ${actionText}`);
      const nextP = { ...state.player, gold: g, stats: ns, skills: nsk, life_sim: { ...state.player.life_sim, needs: n }, inventory: ni, anatomy: na, afflictions: af, quests: q, lewdity_stats: ls, temperature: tp };
      const nextStoryEvent = action.payload.nextStoryEvent !== undefined ? action.payload.nextStoryEvent : state.world.active_story_event;
      // Track completed story arcs when a story event resolves to null
      let completedArcs = [...state.world.completed_story_arcs];
      if (state.world.active_story_event && nextStoryEvent === null) {
        const arcId = state.world.active_story_event.id;
        if (!completedArcs.includes(arcId)) completedArcs.push(arcId);
      }
      return { ...state, memory_graph: mg, world: { ...state.world, hour: nh, day: nd, turn_count: state.world.turn_count + 1, active_story_event: nextStoryEvent, completed_story_arcs: completedArcs, current_location: LOCATIONS[parsedText.new_location] || state.world.current_location }, player: withClothingState(nextP), ui: { ...state.ui, currentLog: nl, isPollingText: false, last_stat_deltas: parsedText.stat_deltas, choices: parsedText.follow_up_choices || state.world.current_location.actions || [] } };
    }
    case 'UPDATE_ACTIVE_ENCOUNTER': {
      if (!state.world.active_encounter) return state;
      const next = { ...state.world.active_encounter, ...action.payload };
      if (Object.keys(action.payload).every(k => (state.world.active_encounter as any)[k] === (next as any)[k])) return state;
      return { ...state, world: { ...state.world, active_encounter: next } };
    }
    case 'SUMMARIZE_MEMORY': {
      if (action.payload?.summary === '[Summary]' || (Array.isArray(action.payload) && action.payload[0] === '[Summary]')) return { ...state, memory_graph: ['[Summary]'] };
      const sArr = Array.isArray(action.payload) ? action.payload : (action.payload.summary ? [action.payload.summary] : ['[Distant Memory]: A lot happened.']);
      const last = state.memory_graph[state.memory_graph.length - 1];
      return { ...state, memory_graph: [...sArr, last] };
    }
    case 'TOGGLE_UI_SETTING': {
      if ((state.ui as any)[action.payload.key] === action.payload.value) return state;
      return { ...state, ui: { ...state.ui, [action.payload.key]: action.payload.value } };
    }
    case 'HORDE_REQUEST_START': return { ...state, ui: { ...state.ui, horde_monitor: { ...state.ui.horde_monitor, active: true, text_requests: action.payload.type === 'text' ? state.ui.horde_monitor.text_requests + 1 : state.ui.horde_monitor.text_requests, image_requests: action.payload.type === 'image' ? state.ui.horde_monitor.image_requests + 1 : state.ui.horde_monitor.image_requests } } };
    case 'ADVANCE_EPOCH': {
      const milestone = action.payload?.milestone;
      const milestones = milestone && !state.world.narrative_milestones.includes(milestone)
        ? [...state.world.narrative_milestones, milestone]
        : state.world.narrative_milestones;
      return { ...state, world: { ...state.world, world_epoch: state.world.world_epoch + 1, narrative_milestones: milestones } };
    }
    case 'COMPLETE_STORY_ARC': {
      const arcId = action.payload.arcId;
      if (state.world.completed_story_arcs.includes(arcId)) return state;
      return { ...state, world: { ...state.world, completed_story_arcs: [...state.world.completed_story_arcs, arcId] } };
    }
    case 'ADD_NARRATIVE_MILESTONE': {
      const ms = action.payload.milestone;
      if (state.world.narrative_milestones.includes(ms)) return state;
      return { ...state, world: { ...state.world, narrative_milestones: [...state.world.narrative_milestones, ms] } };
    }
    default: return state;
  }
}
