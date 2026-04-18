# Project Analysis Skill

## Purpose

Analyze the structure, health, and state of a GitHub repository to produce a clear picture of what work exists, what is in progress, and what is blocked or missing.

---

## When to Use

Use this skill when the agent needs to:

- Understand the current state of a repository before planning
- Audit open issues for completeness and prioritization
- Identify gaps in coverage (missing labels, milestones, or owners)
- Establish a baseline before generating a roadmap or sprint plan

---

## Instructions

### Step 1 — Inventory Open Issues

1. List all open issues in the repository
2. Group them by:
   - **Type**: bug, feature, enhancement, chore, documentation, question
   - **Priority**: P0 (critical), P1 (high), P2 (medium), P3 (low), unset
   - **Area / Component**: inferred from labels, title keywords, or file references
   - **Status**: in-progress (linked PR exists), blocked (blocking label or comment), ready (no blockers), ungroomed (no labels or milestone)
3. Flag issues that are:
   - Older than 90 days with no activity
   - Missing labels or milestones
   - Referenced by other issues but themselves lack structure
   - Assigned to a person but have no linked PR

### Step 2 — Analyze Pull Requests

1. List open PRs and note:
   - Which issues they close or reference
   - How long they have been open
   - Whether they are draft or ready for review
   - Whether CI checks are passing
2. Flag PRs that are:
   - Open more than 14 days with no review
   - Referencing a closed or non-existent issue
   - Failing checks with no recent activity

### Step 3 — Evaluate Milestones

1. List all milestones with their due dates and open/closed issue counts
2. Identify milestones that are:
   - Overdue (due date passed, open issues remain)
   - Under-populated (fewer than 3 issues assigned)
   - Over-populated (more than 30 issues, risk of scope creep)
3. Note milestones with no due date as candidates for timeline assignment

### Step 4 — Assess Label Taxonomy

1. List all labels currently in use
2. Identify:
   - Missing standard labels (priority tiers, type categories, status markers)
   - Duplicate or redundant labels with similar names
   - Labels that are defined but never applied
3. Propose a normalized label set if the current one is incomplete or inconsistent

### Step 5 — Summarize Findings

Produce a structured summary with the following sections:

```markdown
## Project Analysis Summary

### Repository Health
- Total open issues: N
- Total open PRs: N
- Active milestones: N
- Stale issues (>90 days): N

### Issue Breakdown
| Type     | Count | % of Total |
|----------|-------|------------|
| Feature  | ...   | ...        |
| Bug      | ...   | ...        |
| Chore    | ...   | ...        |
| Other    | ...   | ...        |

### Priority Distribution
| Priority | Count |
|----------|-------|
| P0       | ...   |
| P1       | ...   |
| P2       | ...   |
| P3       | ...   |
| Unset    | ...   |

### Risks & Gaps
> ⚠️ [List each identified risk or gap here]

### Recommended Next Steps
1. ...
2. ...
```

---

## Output Format

- Always use Markdown tables for quantitative summaries
- Use `> ⚠️` for risks
- Use `> ℹ️` for informational notes
- Reference specific issues by number (`#N`) when calling out problems

---

## Integration

This skill feeds directly into:

- **roadmap-generation** — the issue inventory and priority data become the input for roadmap phases
- **task-orchestration** — the analysis identifies which issues need to be broken down further
