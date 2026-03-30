# MaxVP Project Quick Start

This is a 5-minute guide to get the MaxVP project board up and running.

## Prerequisites

- GitHub CLI installed: `gh --version`
- Authenticated with project scope: `gh auth refresh -s project`

## Steps

### 1. Create the Project (30 seconds)

Run the automated creation script:

```bash
./scripts/create-maxvp-project.sh romeytheAI user
```

Save the project number from the output (e.g., `23`).

### 2. Configure Views (2 minutes)

Visit your project URL and create these views:

**Board View:**
- Click "+ New view" → Board
- Group by: Status
- Name it: "Kanban"

**Priority Table:**
- Click "+ New view" → Table
- Name it: "By Priority"
- Sort by: Priority ascending

**Timeline View:**
- Click "+ New view" → Roadmap
- Name it: "Timeline"
- Date field: Iteration (if available)

### 3. Sync Roadmap Items (1 minute)

Run the workflow to populate your project:

```bash
gh workflow run sync-agentic-roadmap.yml -f project-number=YOUR_NUMBER
```

Replace `YOUR_NUMBER` with the project number from step 1.

### 4. Verify (30 seconds)

Check the workflow status:

```bash
gh run list --workflow=sync-agentic-roadmap.yml --limit 1
```

Visit your project URL - you should see 6 roadmap items!

## Troubleshooting

**"Command not found: gh"**
- Install GitHub CLI: https://cli.github.com/

**"Missing project scope"**
- Run: `gh auth refresh -s project`

**"Project not found"**
- Verify the project number is correct
- Check it belongs to the right user/org

**"No items in project"**
- Check the workflow run logs
- Manually trigger sync again

## Next Steps

- Review [docs/maxvp-project-setup.md](maxvp-project-setup.md) for detailed configuration
- Read [docs/agentic-roadmap.md](agentic-roadmap.md) for roadmap details
- Start working on P0 items!

## Useful Scripts

```bash
# Verify setup
./scripts/verify-project-setup.sh YOUR_PROJECT_NUMBER

# Re-sync roadmap (safe to run multiple times)
gh workflow run sync-agentic-roadmap.yml -f project-number=YOUR_NUMBER

# Check latest workflow run
gh run list --workflow=sync-agentic-roadmap.yml --limit 1

# View workflow logs
gh run view --log
```
