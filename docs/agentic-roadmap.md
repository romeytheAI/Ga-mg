# MaxVP Agentic Sub-Issue Roadmap

This roadmap breaks the MaxVP agentic initiative into actionable sub-issues and pairs them with automation so we can keep GitHub as the source of truth.

## Sub-issue lineup

| Title | Priority | Focus |
| --- | --- | --- |
| [MaxVP][P0] Bootstrap GitHub Project + live roadmap sync | P0 | Projects V2, project automation |
| [MaxVP][P0] Codespaces + devcontainer parity | P0 | Dev environment parity |
| [MaxVP][P1] Agentic triage for issues and PRs | P1 | Intake automation |
| [MaxVP][P1] Autonomous CI/CD lane for MaxVP | P1 | Test/build/release automation |
| [MaxVP][P1] Agent swarm hooks for SimulationEngine + Horde | P1 | Sim/agent orchestration |
| [MaxVP][P2] Runbooks + dashboards for agentic ops | P2 | Documentation and visibility |

The authoritative issue metadata lives in `docs/agentic-roadmap.json`. The sync workflow below uses that file to open or update GitHub issues and optionally place them into a Projects V2 board.

## How to sync the roadmap into GitHub

1. Navigate to **Actions → Sync Agentic Roadmap**.
2. Choose **Run workflow**:
   - `project-number` (optional): provide the Projects V2 number (e.g., `1`) to auto-add items.
   - `dry-run`: set to false to apply changes.
3. The workflow will:
   - Read `docs/agentic-roadmap.json`.
   - Create or update issues matching the titles above with labels `roadmap`, `maxvp`, `automation`, and area/priority labels.
   - If `project-number` is set, add the issues into that project (user or org projects are both supported).

## Operating notes

- Treat `docs/agentic-roadmap.json` as the single source of truth; edits there will flow to GitHub on the next sync.
- Link the resulting project URL and workflow runs in team docs so agents can observe the automation loop.
- When adding new roadmap items, include acceptance criteria and labels so automation can triage them correctly.
