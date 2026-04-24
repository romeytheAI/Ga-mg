# 🤖 Jules - Automatic Issue Completion Framework

This project utilizes **Jules**, an autonomous AI coding agent from Google Labs, to automatically resolve issues and implement features.

## How it Works

1. **Autonomous Triggering**:
    - **Backlog Mastery**: Jules automatically handles *all* new and reopened issues unless they are explicitly marked with a `blocked` or `blocker` label.
    - **Conflict Resolution**: Jules monitors Pull Requests. If merge conflicts are detected, Jules is automatically summoned to resolve them.
    - **Manual Summoning**: You can still manually trigger Jules by adding the `jules` label to any issue.
2. **Action**: Jules clones the repo in a secure VM, analyzes the code, follows established patterns, and implements a fix.
3. **Review**: Jules creates a Pull Request referencing the issue.
4. **Continuous Learning**: Jules uses the `.jules/` and `.Jules/` directories to maintain continuity and avoid repeating past mistakes.

## Project Learnings

Jules maintains a persistent memory of "learnings" in the following locations:

- [`.jules/bolt.md`](../.jules/bolt.md): General architectural and performance learnings.
- [`.jules/sentinel.md`](../.jules/sentinel.md): Security and vulnerability prevention patterns.
- [`.Jules/palette.md`](../.Jules/palette.md): UI and accessibility standards.

## Setup Requirements

- **JULES_API_KEY**: Must be added to GitHub Repository Secrets.
- **Workflow Permissions**: The GitHub Action requires `contents: read`, `issues: write`, and `pull-requests: write`.

## Benefits

- **Asynchronous Development**: Jules works in the background while you focus on other tasks.
- **Consistency**: Jules adheres to the project's specific coding standards and past lessons.
- **Self-Healing PRs**: Automatically resolves merge conflicts to keep the main branch moving.
