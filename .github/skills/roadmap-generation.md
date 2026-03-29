# Roadmap Generation Skill

## Purpose

Create and maintain structured, phase-based project roadmaps from GitHub issues, milestones, and priorities. Produce Markdown roadmap documents that communicate what is planned, when, and why — across near-term sprints and longer-horizon quarters.

---

## When to Use

Use this skill when the agent needs to:

- Generate a new roadmap from a backlog of issues
- Update an existing roadmap to reflect current state
- Define milestones and assign issues to phases
- Communicate project direction to stakeholders
- Estimate delivery timelines for planned work

---

## Instructions

### Step 1 — Collect and Classify All Planned Work

1. Retrieve all open issues from the repository
2. Classify each issue into one of the following roadmap categories:
   - **Now** — high-priority work actively in progress or immediately next
   - **Next** — confirmed work planned for the upcoming phase or quarter
   - **Later** — desirable work with lower priority or unresolved dependencies
   - **Backlog** — ungroomed or low-confidence items not yet committed to
3. Use existing labels (`priority:*`, `milestone:*`) as primary signals
4. Infer category from age, comment activity, and linked PRs if labels are absent

### Step 2 — Group Work into Themes or Epics

1. Identify thematic clusters in the issue list:
   - Shared label (e.g., `area:sim`, `area:ui`, `area:economy`)
   - Common title keywords (e.g., "NPC", "combat", "economy")
   - Issues that reference each other
2. For each theme, create an **Epic** — a named group of related issues
3. Each Epic should have:
   - A short descriptive title
   - A one-sentence goal statement
   - A list of constituent issues (`#N`)
   - An estimated size: Small (1–3 issues), Medium (4–8), Large (9+)

### Step 3 — Define Milestones and Timeline

1. Map each roadmap phase to a GitHub milestone:
   - **Phase 1 / v0.1** — foundational systems and critical bugs (Now)
   - **Phase 2 / v0.2** — core feature expansion (Next)
   - **Phase 3 / v0.3** — polish, performance, and secondary features (Later)
2. For each milestone, assign:
   - Target due date (estimate if not set; note uncertainty)
   - Included epics and issues
   - Acceptance criteria: what must be true for the milestone to be complete
3. If historical velocity data is available (average issues closed per week), use it to validate or adjust due dates

### Step 4 — Identify Dependencies and Risks

1. For each epic and milestone, note:
   - Issues that must be completed before others can start
   - Issues with external dependencies (third-party APIs, external teams)
   - Issues that are blocked by open questions or decisions
2. Highlight critical path items — the sequence of dependent work that determines the earliest possible delivery date
3. Flag risks:
   - Large epics with unclear scope
   - Milestones with more than 70% of issues ungroomed
   - Phases with no buffer for unexpected work

### Step 5 — Generate Roadmap Document

Produce a Markdown roadmap document in the following format:

```markdown
# Project Roadmap

> Last updated: YYYY-MM-DD  
> Status: [On Track / At Risk / Off Track]

## Vision

[One paragraph describing the overall direction and goals of the project.]

---

## Roadmap Overview

| Phase      | Theme                  | Target     | Status      |
|------------|------------------------|------------|-------------|
| Phase 1    | [Epic name]            | YYYY-MM-DD | In Progress |
| Phase 2    | [Epic name]            | YYYY-MM-DD | Planned     |
| Phase 3    | [Epic name]            | YYYY-MM-DD | Planned     |

---

## Phase 1 — [Phase Title] (Now)

**Target:** YYYY-MM-DD  
**Goal:** [What this phase delivers and why it matters]

### Epics

#### [Epic Name]
> [One-sentence goal]

- [ ] #N — [Issue title]
- [ ] #N — [Issue title]

**Dependencies:** [List or "None"]  
**Risks:** [List or "None"]

---

## Phase 2 — [Phase Title] (Next)

[Same structure as Phase 1]

---

## Phase 3 — [Phase Title] (Later)

[Same structure as Phase 1]

---

## Backlog

Issues not yet committed to a phase:

- #N — [Issue title] — [Reason not yet scheduled]

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk description] | High/Med/Low | High/Med/Low | [Action] |

---

## Change Log

| Date       | Change |
|------------|--------|
| YYYY-MM-DD | [What changed] |
```

---

## Output Format

- Always use Markdown tables for phase overviews and risk registers
- Use `- [ ]` checkboxes for all planned issues so they can be tracked
- Use `> ⚠️` for risks and blockers
- Use `> ℹ️` for notes and assumptions
- Include a "Last updated" date at the top of every roadmap document

---

## Maintenance Instructions

When updating an existing roadmap:

1. Move completed issues from open checkboxes to `~~#N — [title]~~` (strikethrough)
2. Update the "Last updated" date
3. Add a row to the Change Log table
4. Reassess risks and update their status
5. Promote items from Backlog to phases as priorities become clear

---

## Integration

This skill consumes output from:

- **project-analysis** — for the full issue inventory and priority data

This skill produces input for:

- **task-orchestration** — individual epics and issues are handed off for detailed task breakdown
