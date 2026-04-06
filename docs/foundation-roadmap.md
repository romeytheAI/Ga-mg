# Foundation Roadmap

This roadmap breaks the repository foundation work into actionable issues. These are **prerequisite issues** that should be completed before major feature work to ensure a stable, maintainable codebase.

## Priority Rationale

1. **Structure first** → Clear ownership enables focused work
2. **Types second** → Foundation for safe refactoring
3. **Performance third** → Requires stable types to profile effectively
4. **Persistence fourth** → Depends on stable domain types
5. **CI/CD fifth** → Enforces all previous improvements

## Sub-issue lineup

| Title | Priority | Focus | Status |
| --- | --- | --- | --- |
| [Foundation][P0] Restructure repository for app code, assets, and docs | P0 | Repository organization | 📋 Planned |
| [Foundation][P0] Enforce strict domain typing across simulation, rendering, and persistence | P0 | Type safety | 📋 Planned |
| [Foundation][P1] Profile and optimize simulation loop and canvas rendering | P1 | Performance | 📋 Planned |
| [Foundation][P1] Harden Firebase auth, Firestore schema, and save/load flows | P1 | Persistence | 📋 Planned |
| [Foundation][P1] Set up GitHub Actions for typecheck, lint, test, and build | P1 | CI/CD | 📋 Planned |

## Current State Snapshot

### Issue 1: Repository Structure
- **Problem**: 86 loose image files at repo root, unclear asset strategy
- **Impact**: Hard to reason about ownership, build inputs, and asset loading
- **Evidence**: `penis*.png`, `chest*.png`, etc. scattered at top level

### Issue 2: Type Safety
- **Problem**: 319 instances of `any` type, no strict mode enabled
- **Impact**: Runtime type errors, difficult refactoring, lost type safety
- **Evidence**: `tsconfig.json` missing `"strict": true`, grep shows 319 `any` uses

### Issue 3: Performance
- **Problem**: No performance baselines, unknown bottlenecks in sim loop
- **Impact**: Potential frame drops, unclear optimization targets
- **Evidence**: Clear sim/rendering separation exists but no profiling data

### Issue 4: Persistence
- **Problem**: Save schema exists but migration/validation incomplete
- **Impact**: Risk of save corruption, schema drift, auth edge cases
- **Evidence**: `SAVE_SCHEMA_VERSION 2` exists but strategy not documented

### Issue 5: CI/CD
- **Problem**: No automated quality gates for main app
- **Impact**: Regressions can slip through, manual testing burden
- **Evidence**: Only sidecar workflows exist, no PR checks

## How to sync the roadmap into GitHub

The authoritative issue metadata lives in `docs/foundation-roadmap.json`. To create these issues:

**Option 1: Manual creation**
- Copy issue content from the JSON file
- Create issues with appropriate labels: `foundation`, `priority:P0` or `priority:P1`, area labels

**Option 2: Automation (if workflow exists)**
1. Navigate to **Actions → Sync Foundation Roadmap** (if created)
2. Run workflow to auto-create issues from JSON
3. Issues will have labels: `foundation`, area labels, priority labels

## Operating notes

- These are **prerequisite issues** - complete them before major feature work
- Each issue builds on the previous (structure → types → performance → persistence → CI)
- The final CI/CD issue will enforce all previous improvements going forward
- Track progress in the table above or in a GitHub Projects board
