# MaxVP Project Setup Architecture

## Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MaxVP Project Infrastructure                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│  Documentation   │         │  Automation      │
├──────────────────┤         ├──────────────────┤
│                  │         │                  │
│  • Quick Start   │◄───────►│  • Create Script │
│  • Setup Guide   │         │  • Verify Script │
│  • Summary       │         │                  │
│                  │         │                  │
└─────────┬────────┘         └────────┬─────────┘
          │                           │
          │                           │
          │      ┌────────────────────┤
          │      │                    │
          ▼      ▼                    ▼
┌─────────────────────────────────────────────┐
│         GitHub Projects V2 Board             │
├─────────────────────────────────────────────┤
│                                             │
│  Custom Fields:                             │
│    • Status   (Backlog → Done)              │
│    • Priority (P0 → P3)                     │
│    • Risk     (High → None)                 │
│    • Area     (6 categories)                │
│    • Owner    (agents/humans)               │
│                                             │
│  Views:                                     │
│    • Kanban Board (by Status)               │
│    • Priority Table (filtered)              │
│    • Agent Work (owner-filtered)            │
│    • Timeline (roadmap view)                │
│                                             │
└───────────┬─────────────────────────────────┘
            │
            │ Populated by
            ▼
┌─────────────────────────────────────────────┐
│   Sync Agentic Roadmap Workflow              │
├─────────────────────────────────────────────┤
│  .github/workflows/sync-agentic-roadmap.yml │
│                                             │
│  • Reads: docs/agentic-roadmap.json         │
│  • Creates/Updates: GitHub Issues           │
│  • Links: Issues → Project                  │
│  • Applies: Labels & Assignments            │
│                                             │
└───────────┬─────────────────────────────────┘
            │
            │ Syncs from
            ▼
┌─────────────────────────────────────────────┐
│      Roadmap Definition (Source of Truth)    │
├─────────────────────────────────────────────┤
│  docs/agentic-roadmap.json                  │
│                                             │
│  6 Items:                                   │
│    • [P0] Bootstrap Project (projects)       │
│    • [P0] Codespaces (codespaces)           │
│    • [P1] Agentic Triage (triage)           │
│    • [P1] CI/CD Lane (cicd)                 │
│    • [P1] Agent Swarm Hooks (sim)           │
│    • [P2] Runbooks (docs)                   │
│                                             │
└─────────────────────────────────────────────┘
```

## Setup Flow

```
User
 │
 ├─► Run: ./scripts/create-maxvp-project.sh
 │    │
 │    ├─► Authenticate with GitHub (project scope)
 │    ├─► Call GraphQL API: createProjectV2
 │    ├─► Create custom fields via GraphQL
 │    └─► Output: Project Number (e.g., 23)
 │
 ├─► Run: gh workflow run sync-agentic-roadmap.yml -f project-number=23
 │    │
 │    ├─► Workflow reads agentic-roadmap.json
 │    ├─► Creates 6 GitHub Issues with labels
 │    ├─► Links issues to Project #23
 │    └─► Reports summary in workflow logs
 │
 ├─► Visit Project URL in browser
 │    │
 │    ├─► Configure Board view (group by Status)
 │    ├─► Configure Table view (sort by Priority)
 │    ├─► Configure Timeline view (by Iteration)
 │    └─► Start working on P0 items!
 │
 └─► Verify: ./scripts/verify-project-setup.sh 23
      │
      └─► Confirms project exists and is accessible
```

## Data Flow

```
┌────────────────────┐
│  Roadmap JSON      │  (Source of Truth)
│  6 items defined   │
└─────────┬──────────┘
          │
          │ Read by
          ▼
┌────────────────────┐
│  Sync Workflow     │  (Automation)
│  - Create issues   │
│  - Apply labels    │
│  - Link to project │
└─────────┬──────────┘
          │
          │ Populates
          ▼
┌────────────────────┐
│  GitHub Issues     │  (Work Items)
│  6 issues created  │
└─────────┬──────────┘
          │
          │ Displayed in
          ▼
┌────────────────────┐
│  Project Board     │  (Tracking)
│  Multiple views    │
│  Custom fields     │
└────────────────────┘
```

## Integration Points

### For Agents

```javascript
// Agents can interact via GraphQL or REST API
// Example: Query project items
const items = await github.graphql(`
  query($projectId: ID!) {
    node(id: $projectId) {
      ... on ProjectV2 {
        items(first: 100) {
          nodes {
            content {
              ... on Issue { number, title, labels }
            }
            fieldValues(first: 10) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field { name }
                }
              }
            }
          }
        }
      }
    }
  }
`, { projectId });

// Update field values
await github.graphql(`
  mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) {
    updateProjectV2ItemFieldValue(input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { singleSelectOptionId: $value }
    }) {
      projectV2Item { id }
    }
  }
`, { projectId, itemId, fieldId, value });
```

### For CI/CD

```yaml
# In GitHub Actions workflows
- name: Update Project Status
  uses: actions/github-script@v7
  with:
    script: |
      // On PR merge, move item to "Done"
      // On test failure, set Risk to "High"
      // On agent assignment, update Owner field
```

## File Structure

```
Ga-mg/
├── docs/
│   ├── agentic-roadmap.json          [Source: 6 roadmap items]
│   ├── agentic-roadmap.md            [Overview & strategy]
│   ├── maxvp-quickstart.md           [5-min setup guide]
│   ├── maxvp-project-setup.md        [Detailed instructions]
│   └── IMPLEMENTATION_SUMMARY.md     [This implementation]
├── scripts/
│   ├── create-maxvp-project.sh       [GraphQL automation]
│   └── verify-project-setup.sh       [Validation tool]
├── .github/workflows/
│   └── sync-agentic-roadmap.yml      [Issue sync workflow]
└── README.md                          [Updated with links]
```

## Benefits

1. **Automation**: One command creates entire project structure
2. **Idempotency**: Safe to re-run sync workflow
3. **Visibility**: All work tracked in one board
4. **Consistency**: Standardized fields across items
5. **Integration**: Hooks for CI/CD and agents
6. **Documentation**: Comprehensive guides at every level

## Maintenance

- **Add Items**: Edit `agentic-roadmap.json`, push, workflow auto-syncs
- **Update Fields**: In project UI or via GraphQL
- **Generate Reports**: Query project via GitHub API
- **Agent Actions**: Use GraphQL mutations to update status/fields
