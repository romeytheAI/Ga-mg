# MaxVP GitHub Project Setup Guide

This guide walks you through setting up the GitHub Projects V2 board for the MaxVP agentic automation initiative.

## Overview

The MaxVP project board tracks all work items from the agentic roadmap defined in `docs/agentic-roadmap.json`. It provides visibility into priorities, ownership, iterations, and risks across the full-stack automation effort.

## Quick Setup

You have two options for setting up the project:

### Option A: Automated Setup (Recommended)

Use the provided script to create the project with all fields configured automatically:

```bash
# Ensure you have GitHub CLI with project scope
gh auth refresh -s project

# Run the creation script
./scripts/create-maxvp-project.sh romeytheAI user

# The script will output your project number - save it!
```

This script creates the project and all custom fields automatically. You'll still need to manually configure the views (see step 3 below).

### Option B: Manual Setup

#### 1. Create the Project

1. Navigate to your GitHub profile or organization
2. Go to **Projects** → **New project**
3. Choose **Table** as the starting template
4. Name it: **MaxVP Agentic**
5. (Optional) Add description: "Agentic full-stack automation for MaxVP product development"

### 2. Configure Custom Fields

Add the following custom fields to your project (Settings → Custom fields):

| Field Name | Type | Options/Config |
|------------|------|----------------|
| Status | Single select | `Backlog`, `Ready`, `In Progress`, `Review`, `Done` |
| Priority | Single select | `P0 - Critical`, `P1 - High`, `P2 - Medium`, `P3 - Low` |
| Owner | Text | (free-form text for agent/human names) |
| Iteration | Iteration | Configure 2-week iterations |
| Risk | Single select | `High`, `Medium`, `Low`, `None` |
| Area | Single select | `projects`, `codespaces`, `triage`, `cicd`, `sim`, `docs` |

### 3. Create Views

Create the following views for different perspectives:

#### View 1: Kanban Board
- **Type**: Board
- **Group by**: Status
- **Filter**: (none - show all)
- **Sort**: Priority (P0 first)

#### View 2: Priority Table
- **Type**: Table
- **Columns**: Title, Status, Priority, Owner, Area, Risk
- **Filter**: Status != Done
- **Sort**: Priority ascending

#### View 3: Agent Work
- **Type**: Table
- **Filter**: Owner contains "agent" OR Owner contains "codex"
- **Columns**: Title, Status, Priority, Iteration, Area
- **Sort**: Priority, then Status

#### View 4: Timeline
- **Type**: Roadmap
- **Date field**: Iteration
- **Group by**: Area
- **Show**: All items

### 4. Get Your Project Number

After creating the project:
1. Go to your project
2. Look at the URL: `https://github.com/users/{username}/projects/{NUMBER}` or `https://github.com/orgs/{org}/projects/{NUMBER}`
3. Note the **NUMBER** - you'll need this for automation

### 5. Run the Sync Workflow

Now that your project is set up, sync the roadmap items into it:

1. Go to **Actions** → **Sync Agentic Roadmap**
2. Click **Run workflow**
3. Enter your project number in the `project-number` field
4. Leave `dry-run` as `false`
5. Click **Run workflow**

The workflow will:
- Create/update issues from `docs/agentic-roadmap.json`
- Apply labels: `roadmap`, `maxvp`, `automation`, plus area/priority labels
- Add all issues to your project automatically

### 6. Verify Setup

After the workflow completes:
1. Check your project - you should see 6 items (P0, P0, P1, P1, P1, P2)
2. Verify all fields are populated correctly
3. Switch between views to ensure they work

## Project Maintenance

### Adding New Roadmap Items

1. Edit `docs/agentic-roadmap.json`
2. Add your new item to the `issues` array:
   ```json
   {
     "title": "[MaxVP][P1] Your Feature Title",
     "body_lines": [
       "Description of the feature...",
       "- Task 1",
       "- Task 2",
       "",
       "Acceptance criteria:",
       "- Criterion 1",
       "- Criterion 2"
     ],
     "labels": ["roadmap", "maxvp", "automation", "area:your-area", "priority:P1"],
     "assignees": []
   }
   ```
3. Commit and push (or the workflow will run automatically on push)
4. Manually trigger the sync workflow if needed

### Updating Existing Items

The sync workflow is idempotent:
- It updates issue bodies and labels when they change
- It won't duplicate issues with the same title
- It safely handles items already in the project

### Manual Project Management

You can also manage items directly in GitHub:
- Drag items between Status columns in board view
- Update Priority, Owner, Risk fields inline
- Add notes or convert notes to issues
- Link related PRs and issues

## Automation Integration

### CI/CD Hooks

Once the project is set up, CI/CD workflows can:
- Update item status when PRs are opened/merged
- Set Risk field based on test failures
- Auto-assign Owners based on code ownership

### Agent Workflows

Agents can query and update the project via GraphQL:
- List items by priority/status
- Update fields when work begins/completes
- Add comments with progress updates

See `docs/agentic-roadmap.md` for details on agent integration patterns.

## Troubleshooting

### Workflow fails with "Project not found"
- Verify the project number is correct
- Ensure the project belongs to the repo owner (user or org)
- Check workflow permissions include `projects: write`

### Items not appearing in project
- Check the workflow run logs for errors
- Verify labels were applied correctly
- Manually add an item to test project access

### Fields missing or incorrect
- Re-create custom fields with exact names from the table above
- Case-sensitive: "Priority" not "priority"
- Single select options must match exactly

## Project URL

After setup, update this section with your project URL:

**Project URL**: `https://github.com/users/romeytheAI/projects/{YOUR_NUMBER_HERE}`

Or for organizations:

**Project URL**: `https://github.com/orgs/{ORG_NAME}/projects/{YOUR_NUMBER_HERE}`

## References

- [GitHub Projects V2 Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- Roadmap definition: `docs/agentic-roadmap.json`
- Sync workflow: `.github/workflows/sync-agentic-roadmap.yml`
- Roadmap overview: `docs/agentic-roadmap.md`
