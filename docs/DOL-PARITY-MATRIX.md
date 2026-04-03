# DoL Parity Matrix

This matrix is the implementation source of truth for bringing Ga-mg to Degrees of Lewdity gameplay and visual parity while preserving the project's Elder Scrolls framing.

## 1. Core gameplay systems

- [ ] Time loop, daily cadence, and scheduled world state
- [ ] School, work, chores, class attendance, and repeatable daily routines
- [ ] Money pressure, rent/debt escalation, and recurring payments
- [ ] Full stat lifecycle: stress, trauma, control, arousal, pain, purity, corruption, fatigue
- [ ] Crime, guard response, jail flow, and notoriety/fame consequences
- [ ] Relationship state, love/fear/trust, jealousy, domination/submission drift
- [ ] Pregnancy, fertility cycle, birth recovery, lactation, and parasite lifecycle
- [ ] Clothing integrity, displacement, wetness, exposure, and damage consequences
- [ ] Inventory, equipment, consumables, shops, and clothing state persistence
- [ ] Feats, traits, long-term conditions, addictions, and recurring status effects

## 2. Content and event systems

- [ ] Unified event engine for encounters, location scenes, NPC scenes, and special events
- [ ] Branching outcomes with checks, flags, repeatability rules, and location transitions
- [ ] Random encounter pools by time, place, risk, and progression
- [ ] Multi-step story trees for key hostile, social, and romance interactions
- [ ] Content gating by stats, quest flags, relationship state, and clothing/exposure state

## 3. World simulation and schedules

- [ ] Location availability by hour/day/weather
- [ ] NPC schedule/state transitions across locations
- [ ] Repeatable economy, jobs, school attendance, and service loops
- [ ] Dynamic location populations, stalking/following, and ambient world state

## 4. Visual parity

- [ ] Layered body, face, hair, and anatomy state coverage
- [ ] Clothing layers, integrity stages, displacement states, and visibility rules
- [ ] Fluids, stains, wetness, body marks, and status overlays
- [ ] Encounter pose matrix, restraint states, and targeted-part feedback
- [ ] Expression, arousal, pain, exhaustion, weather, and activity animations
- [ ] Canvas and SVG renderers kept in sync for the same state inputs

## 5. UI parity

- [ ] Stats and condition inspection
- [ ] Wardrobe and clothing-state management
- [ ] Social/NPC relationship inspection
- [ ] Encounter and event choice surfaces
- [ ] Save/load, migration feedback, and version awareness
- [ ] Map, journal, quest, trait, feat, and inventory parity surfaces

## 6. Save and modding foundation

- [x] Save schema version constant
- [x] Save migration entry point for older/incomplete save data
- [ ] Explicit migration chain by schema version
- [ ] Save validation and corruption recovery messaging
- [ ] Extensible data registries for advanced downstream modifications

## Current milestone focus

Phase 1 ✅:

- parity checklist documentation
- save compatibility groundwork
- event-engine extraction from one-off App flows

Phase 2 ✅:

- Replaced `any` types with proper TypeScript interfaces for all player domains
- Added `NpcRelationship` type and `npc_relationships` map to world state
- Added `event_flags` to world state for content gating
- Added `ADVANCE_TIME` reducer (hour/day, stat drains, Bailey debt, incubation tick, temperature)
- Added `UPDATE_NPC_RELATIONSHIP` / `SET_NPC_SCENE_FLAG` reducers
- Added `SET_EVENT_FLAG` / `CLEAR_EVENT_FLAG` reducers
- Added `DAMAGE_CLOTHING` reducer
- Added `ADD_JUSTICE_BOUNTY` / `CLEAR_JUSTICE_BOUNTY` reducers
- Full reducer test coverage for all Phase 2 actions
