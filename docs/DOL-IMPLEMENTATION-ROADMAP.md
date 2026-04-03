# DoL Implementation Roadmap

## Milestone 1 — parity foundation

Scope:

- define the parity matrix
- add save schema/version groundwork
- extract reusable story-event helpers from App logic

Acceptance:

- documentation exists for parity scope and sequencing
- saves load through a migration/normalization layer
- story-event start/step logic is reusable and tested

## Milestone 2 — gameplay state completion ✅

Scope:

- close remaining gaps in persistent player/world state
- ensure reducer support for direct mutation and long-term state transitions

Completed:

- Replaced `any` types with proper interfaces: `PlayerJustice`, `PlayerPsychology`, `PlayerPerksFlaws`, `PlayerSocial`, `PlayerArcane`, `PlayerBase`, `PlayerSubconscious`
- Added `NpcRelationship` interface and `npc_relationships` map on world
- Added `event_flags: Record<string, boolean | number>` on world for content gating
- New reducers: `ADVANCE_TIME`, `UPDATE_NPC_RELATIONSHIP`, `SET_NPC_SCENE_FLAG`, `SET_EVENT_FLAG`, `CLEAR_EVENT_FLAG`, `DAMAGE_CLOTHING`, `ADD_JUSTICE_BOUNTY`, `CLEAR_JUSTICE_BOUNTY`
- Full reducer test coverage for Phase 2 actions (403 tests total)

## Milestone 3 — unified event engine ✅

Scope:

- move encounter, location, and NPC branching to a shared event model
- support conditions, consequences, flags, and repeatability

Completed:

- `src/utils/encounterEngine.ts` — pure `resolveEncounterAction(state, intent, targetedPart?, rng?)` replaces 370-line encounter block. Returns `{ narrative, stat_deltas, skill_deltas, encounterUpdates, endEncounter, side_effects, combatFeedback }`. Injectable RNG for deterministic testing.
- `src/utils/locationEventEngine.ts` — pure `resolveLocationAction(state, action, ...)` and `annotateActionsWithChance()`. Returns discriminated union `{ kind: 'story_event' | 'narrative' | 'none' }`.
- `App.tsx` reduced by ~330 lines — now a thin coordinator that calls the engines and dispatches results.
- `initialState.ts` — uses `annotateActionsWithChance` instead of inline mapping.
- 36 new tests across `encounterEngine.test.ts` and `locationEventEngine.test.ts` (439 tests total).

## Milestone 4 — schedules and daily-life loop ✅

Scope:

- NPC schedules
- class/work/job loops
- availability windows and population shifts

Completed:

- `src/types.ts` — `NpcScheduleSlot`, `NpcTimeWindow`, `NpcScheduleConditions`, `NpcSchedule` interfaces; `week_day` field added to world state
- `src/state/initialState.ts` — `week_day: 0` initialised
- `src/utils/saveManager.ts` — old saves normalised via `{ ...initialState.world, ...world }` spread (week_day defaults to 0)
- `src/data/npcSchedules.ts` — schedule definitions for all 25 NPCs (school/work/leisure/sleep slots, weekday vs weekend variants, midnight-wrap time windows, milestone/event-flag conditions)
- `src/utils/scheduleEngine.ts` — pure query helpers:
  - `isSlotActive()` — time window + conditions check with midnight wrap
  - `getActiveSlot()` — first matching slot for an NPC
  - `getNpcCurrentLocation()` — where one NPC is right now
  - `getAvailableNpcsAtLocation()` — all NPCs at a given location right now
  - `getAllNpcCurrentLocations()` — full NPC→location map for the current moment
  - `computeDailyStatDeltas()` — passive stat decay, NPC trust drift, economy income tick
  - `advanceWeekDay()` — modular week-day arithmetic
- `src/reducers/gameReducer.ts` — `ADVANCE_TIME` now maintains `week_day`, applies `computeDailyStatDeltas` for NPC trust decay and economy income, and increments player gold
- 36 new tests in `scheduleEngine.test.ts` (475 tests total)

## Milestone 5 — NPC relationship depth ✅

Scope:

- trust, love, fear, dominance/submission, milestones, recurring scenes

Completed:

- `src/types.ts` — `NpcRelationship` extended with `last_interaction_day` and `interaction_count`
- `src/utils/saveManager.ts` — old saves auto-migrated: `last_interaction_day` and `interaction_count` default to 0
- `src/utils/relationshipEngine.ts` — pure relationship mechanics:
  - `computeMilestone()` — derives milestone from trust+love sum (6 thresholds)
  - `computeIntentDeltas()` — per-intent base deltas × milestone bonus × same-day diminishing returns
  - `getTriggeredScene()` / `canTriggerScene()` — recurring-scene gates (milestone, interaction count, seen flag, repeatability)
  - `getInteractionNarrative()` — contextual narrative lines per intent × milestone (injectable RNG)
  - `resolveRelationshipInteraction()` — master resolver: applies deltas, recomputes milestone, gates scenes, marks seen flags, tracks `_today_count`
  - `UNIVERSAL_RECURRING_SCENES` — 8 milestone-gated scenes (first_meeting through bonded_ritual + repeatable regular_date)
  - `BASE_INTENT_DELTAS` — deltas for all 15 dialogue intents plus dom/submit
- `src/reducers/gameReducer.ts` — `RESOLVE_NPC_INTERACTION` action; updated fallback NPC objects for `UPDATE_NPC_RELATIONSHIP` and `SET_NPC_SCENE_FLAG` to include new fields
- 45 new tests in `relationshipEngine.test.ts` (520 tests total)

## Milestone 6 — clothing and exposure mechanics

Scope:

- multi-layer clothing state
- damage/displacement/wetness/exposure rules
- gameplay consequences tied to visual state

Acceptance:

- clothing state is mechanically relevant and persisted
- wardrobe and event systems read the same clothing-state model

## Milestone 7 — visual parity completion

Scope:

- fill pose/state matrix across SVG and canvas renderers
- complete fluids, marks, restraint, and expression coverage

Acceptance:

- major gameplay states are visibly represented in both renderers
- renderer tests cover critical parity states

## Milestone 8 — UI completion and balancing

Scope:

- complete parity surfaces for stats, social, wardrobe, events, and saves
- tune systems after the parity foundation lands

Acceptance:

- all major mechanics are inspectable and controllable through UI
- milestone validation passes for tests/build and targeted parity checks
