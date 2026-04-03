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

## Milestone 3 — unified event engine

Scope:

- move encounter, location, and NPC branching to a shared event model
- support conditions, consequences, flags, and repeatability

Acceptance:

- App no longer contains duplicated event-start/event-step branches
- event definitions are data-driven and testable

## Milestone 4 — schedules and daily-life loop

Scope:

- NPC schedules
- class/work/job loops
- availability windows and population shifts

Acceptance:

- location content changes by time/state
- daily systems drive meaningful stat, economy, and relationship changes

## Milestone 5 — NPC relationship depth

Scope:

- trust, love, fear, dominance/submission, milestones, recurring scenes

Acceptance:

- NPC interactions are stateful and schedule-aware
- dialogue/event conditions react to relationship state

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
