# Task Orchestration Skill

## Purpose

Break down high-level work items (epics, features, issues) into sequenced, dependency-aware tasks. Produce structured task plans that teams can immediately act on, with clear ownership, acceptance criteria, and sequencing.

---

## When to Use

Use this skill when the agent needs to:

- Decompose a large issue or epic into smaller, executable tasks
- Sequence tasks based on dependencies and critical path
- Generate sprint plans from a prioritized backlog
- Identify blockers before work begins
- Create sub-issues or checklists inside an existing GitHub issue

---

## Instructions

### Step 1 — Understand the Goal

1. Read the issue or epic in full, including all comments
2. Identify:
   - The core outcome or deliverable
   - Any stated constraints (technology, timeline, scope)
   - Related issues, PRs, or discussions linked in the body or comments
   - Existing partial work (open PRs, branches, commits referenced)
3. Ask clarifying questions if the goal is ambiguous — do not proceed with a flawed decomposition

### Step 2 — Identify All Required Work

1. List every piece of work that must be done to achieve the goal
2. Classify each item as:
   - **Research / Investigation** — gather information before implementation
   - **Design** — architecture, data model, or UX decisions
   - **Implementation** — code changes, new features, refactors
   - **Testing** — unit tests, integration tests, manual verification
   - **Documentation** — code comments, README updates, wiki pages
   - **Review** — code review, stakeholder sign-off, QA
3. Do not collapse types — a single feature often requires all six categories

### Step 3 — Map Dependencies

1. For each task, identify:
   - Tasks it **blocks** (cannot start until this one is done)
   - Tasks it **is blocked by** (cannot start until those are done)
   - Tasks it can be done **in parallel** with
2. Produce a dependency list:
   ```
   Task A → Task B → Task C
   Task D (parallel with B)
   Task E → Task F (depends on both B and D)
   ```
3. Identify the **critical path**: the longest chain of dependencies that determines minimum delivery time

### Step 4 — Assign Priorities and Estimates

1. For each task, assign:
   - **Priority**: P0 (blocking everything), P1 (high value), P2 (medium), P3 (nice to have)
   - **Size estimate**: XS (< 1 hour), S (1–4 hours), M (4–8 hours), L (1–3 days), XL (> 3 days)
   - **Owner type**: Frontend, Backend, DevOps, Design, QA, Any
2. Flag any task estimated XL — these should be decomposed further into smaller tasks
3. Flag tasks with no clear owner type as "needs assignment"

### Step 5 — Produce Structured Task Breakdown

Output the task plan in the following format:

```markdown
## Task Breakdown: [Epic / Issue Title] (#N)

**Goal:** [One sentence describing what done looks like]  
**Estimated total effort:** [Sum of size estimates]  
**Critical path:** Task A → Task B → Task C

---

### Sequence Plan

#### Phase 1 — Research & Design

- [ ] **[Task title]** — [Brief description of what to do and why]
  - **Type:** Research
  - **Priority:** P1
  - **Size:** S
  - **Depends on:** Nothing
  - **Blocks:** Phase 2 tasks

#### Phase 2 — Implementation

- [ ] **[Task title]** — [Brief description]
  - **Type:** Implementation
  - **Priority:** P0
  - **Size:** M
  - **Depends on:** [Task from Phase 1]
  - **Blocks:** Testing tasks

- [ ] **[Task title]** — [Brief description] *(parallel with above)*
  - **Type:** Implementation
  - **Priority:** P1
  - **Size:** S
  - **Depends on:** [Task from Phase 1]
  - **Blocks:** Testing tasks

#### Phase 3 — Testing & Review

- [ ] **[Task title]** — [Brief description]
  - **Type:** Testing
  - **Priority:** P1
  - **Size:** S
  - **Depends on:** All Phase 2 tasks
  - **Blocks:** Documentation

#### Phase 4 — Documentation & Merge

- [ ] **[Task title]** — [Brief description]
  - **Type:** Documentation
  - **Priority:** P2
  - **Size:** XS
  - **Depends on:** Testing tasks
  - **Blocks:** Nothing

---

### Dependency Graph

```
[Task A] → [Task B] → [Task D]
               ↑          ↑
           [Task C] ──────┘
```

### Risks & Blockers

> ⚠️ [Describe any known blocker or risk, and what needs to happen to unblock it]

### Open Questions

> ℹ️ [List any unresolved questions that could affect scope or sequencing]
```

---

### Step 6 — Generate Sub-Issues (Optional)

If the issue is large enough to warrant sub-issues:

1. For each major task or phase, propose a new GitHub issue with:
   - Title: `[Parent title] — [Task title]`
   - Body: task description, acceptance criteria, dependencies
   - Labels: `type:task`, appropriate `area:*` and `priority:*` labels
   - Milestone: same as parent
2. Propose adding a checklist to the parent issue linking all sub-issues

---

## Output Format

- Use `- [ ]` checkboxes for all tasks so they can be tracked directly in GitHub
- Use nested bullet points to show task detail (type, priority, size, dependencies)
- Use `> ⚠️` for blockers and risks
- Use `> ℹ️` for open questions and notes
- Use ASCII dependency graphs for visual clarity
- Always include the issue number (`#N`) in the heading

---

## Sprint Planning Mode

When generating a sprint plan from a backlog:

1. Accept a sprint duration (default: 2 weeks) and team capacity (default: 40 person-hours)
2. Select issues from the backlog in priority order until capacity is reached
3. For each selected issue, apply this skill to produce its task breakdown
4. Output a combined sprint plan with:
   - Sprint goal statement
   - Issue list with size estimates and owners
   - Total estimated effort vs. capacity
   - Known risks for the sprint

---

## Integration

This skill consumes output from:

- **project-analysis** — for understanding which issues need decomposition
- **roadmap-generation** — for epic and milestone context

This skill produces:

- Structured task breakdowns ready for developer action
- Sub-issue proposals for large epics
- Sprint plans ready for team review
