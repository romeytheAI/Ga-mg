# GitHub Copilot Agents — Setup & Usage

This directory configures custom GitHub Copilot agents and reusable skills for the **Ga-mg** repository. These agents extend Copilot with domain-specific expertise and structured workflows tailored to this project.

---

## Directory Structure

```
.github/
├── agents/
│   ├── my-agent.agent.md                 # Autonomous Life Sim Game Builder agent
│   └── orchestrator-roadmap-agent.md     # Orchestrator & Roadmap Agent
├── skills/
│   ├── project-analysis.md               # Analyze project structure and work inventory
│   ├── roadmap-generation.md             # Create and maintain phased roadmaps
│   └── task-orchestration.md             # Break down work into sequenced tasks
└── README.md                             # This file
```

---

## Agents

### Autonomous Life Sim Game Builder (`my-agent.agent.md`)

A fully autonomous game development agent that builds and evolves a complete indie life simulation game. It handles all engineering, systems design, AI architecture, and procedural generation work for the Ga-mg project.

**Use for:** Feature implementation, system design, code generation, architecture decisions.

---

### Orchestrator & Roadmap Agent (`orchestrator-roadmap-agent.md`)

A project management and planning agent that orchestrates work across the repository. It analyzes issues and PRs, creates structured roadmaps, breaks down epics into tasks, and generates status reports.

**Use for:** Planning, roadmapping, task decomposition, sprint planning, status reporting.

---

## Skills

Skills are reusable instruction sets that agents can apply. The Orchestrator & Roadmap Agent uses all three skills in combination.

| Skill | File | Purpose |
|-------|------|---------|
| Project Analysis | `skills/project-analysis.md` | Inventory issues, PRs, and milestones; surface gaps and risks |
| Roadmap Generation | `skills/roadmap-generation.md` | Build phased roadmaps with timelines and epics |
| Task Orchestration | `skills/task-orchestration.md` | Decompose issues into sequenced, dependency-mapped tasks |

---

## Using the Orchestrator & Roadmap Agent

### In GitHub Copilot Chat (github.com or VS Code)

1. Open Copilot Chat
2. Select **Orchestrator & Roadmap Agent** from the agent dropdown
3. Enter one of the example prompts below

### Example Prompts

| What you want | Prompt |
|---|---|
| Full project plan | `"Orchestrate the work for this repository into a structured project plan"` |
| 6-month roadmap | `"Create a 6-month roadmap based on our open issues and priorities"` |
| Break down an issue | `"Break down issue #42 into subtasks with dependencies"` |
| Sprint plan | `"Generate a 2-week sprint plan from the current backlog"` |
| Status report | `"Summarize project progress and identify what is at risk"` |
| Risk assessment | `"Identify blockers and risks in our current roadmap"` |
| Label audit | `"Audit our issue labels and propose a normalized taxonomy"` |

---

## VS Code Configuration

To enable agent and skill discovery in VS Code, add the following to your workspace `settings.json`:

```json
{
  "chat.useAgentsMdFile": true,
  "chat.useNestedAgentsMdFiles": true,
  "chat.agentFilesLocations": { ".github/agents": true },
  "chat.agentSkillsLocations": { ".github/skills": true },
  "chat.useAgentSkills": true
}
```

---

## Requirements

- GitHub Copilot Pro, Pro+, Business, or Enterprise subscription
- Repository must be on GitHub (not a managed user account repo)
- Agent files must be on the default branch to be discoverable

---

## Adding New Agents or Skills

1. Create a new `.md` file in `.github/agents/` for a new agent
2. Add the YAML front matter block with `name` and `description` fields
3. Write the agent instructions in Markdown below the front matter
4. For new skills, create a `.md` file in `.github/skills/` and reference the skill name in the agent's `## Skills` section
5. Merge to the default branch — the agent becomes available immediately

---

## References

- [GitHub Copilot Custom Agents Documentation](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Managing Copilot Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/manage-agents)
- [Preparing for Custom Agents (Organizations)](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents)
