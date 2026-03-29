# AI Dev Hub — Setup Guide

This document explains the vibe-coding–friendly AI tooling added to this repository.
Everything is designed to work **immediately with no setup**, while optional power-ups can be enabled later.

---

## What Was Added

| File | Purpose |
|---|---|
| `.github/copilot-instructions.md` | Global Gold Rules — Copilot reads this automatically in every chat session |
| `.github/agents/senior-dev.agent.md` | Senior engineer agent profile |
| `.github/agents/refactorer.agent.md` | Refactoring-focused agent profile |
| `.github/agents/test-engineer.agent.md` | Testing-focused agent profile |
| `.github/agents/security-reviewer.agent.md` | Security review agent profile |
| `.github/agents/docs-writer.agent.md` | Documentation writer agent profile |
| `.vscode/mcp.json` | MCP server configuration for VS Code Copilot |
| `docs/ai-hub.md` | This file |

---

## Works Right Now (Zero Setup)

### Copilot Instructions
`.github/copilot-instructions.md` is picked up automatically by GitHub Copilot in VS Code and on GitHub.com.
It tells Copilot to:
- Make small diffs, ask at most 3 clarifying questions, always add tests, never commit secrets.
- Follow this repo's TypeScript style and architecture conventions.

No action needed — it's active as soon as the file is on the default branch.

### Agent Profiles
Use agents in **VS Code Copilot Chat** by typing `@<agent-name>`:

```
@senior-dev Review this PR and flag any risks.
@refactorer Clean up NeedsSystem.ts without changing behavior.
@test-engineer Write tests for UtilityAI.ts.
@security-reviewer Check the Firebase rules for open access.
@docs-writer Document the new ArcaneSystem public API.
```

> **Note**: Custom agent discovery requires GitHub Copilot with agent support enabled in your VS Code settings.
> The `.github/agents/` directory is the standard location GitHub Copilot reads from.

### Filesystem MCP Server (enabled by default)
The `filesystem` MCP server in `.vscode/mcp.json` lets Copilot read and write files in your workspace directly.
It is enabled by default and **requires no credentials**.

This is the most immediately useful "vibe coding" server — Copilot can browse the codebase, read files before editing, and make surgical changes without copy-pasting.

---

## Optional Servers (disabled by default)

Enable any of these by opening `.vscode/mcp.json` and changing `"disabled": false` for the server you want.
Some require API keys — see the table below.

| Server | What It Does | Credentials Needed |
|---|---|---|
| `github` | Search issues, manage PRs, read other repos | `GITHUB_TOKEN` env var |
| `fetch` | Fetch any public URL (docs, APIs) | None |
| `firecrawl` | Deep web crawl for research | `FIRECRAWL_API_KEY` ([firecrawl.dev](https://firecrawl.dev)) |
| `postgres` | Query PostgreSQL / Supabase DB | `POSTGRES_CONNECTION_STRING` env var |
| `sqlite` | Query local `dev.db` SQLite file | None (just enable + set path) |
| `memory` | Persistent memory across Copilot sessions | None (local store) |
| `sequential-thinking` | Step-by-step reasoning before code gen | None |
| `brave-search` | Web search via Brave | `BRAVE_API_KEY` ([api.search.brave.com](https://api.search.brave.com)) |
| `everart` | AI image generation for sprites/assets | `EVERART_API_KEY` |

### How to enable a server

1. Open `.vscode/mcp.json`.
2. Find the server entry (e.g. `"fetch"`).
3. Change `"disabled": true` → `"disabled": false`.
4. If it needs a token, add the variable to your `.env` file (never commit it).
5. Reload VS Code / restart Copilot Chat.

### Setting environment variables (example)

```bash
# .env  (this file is gitignored)
GITHUB_TOKEN=ghp_yourTokenHere
FIRECRAWL_API_KEY=fc_yourKeyHere
POSTGRES_CONNECTION_STRING=postgresql://user:pass@localhost:5432/mydb
BRAVE_API_KEY=BSA_yourKeyHere
```

---

## Security Notes

- `.env` is in `.gitignore` — never commit it.
- `.env.example` contains only placeholder values — safe to commit.
- All optional MCP servers that require credentials are **disabled by default**.
- The `security-reviewer` agent profile can audit PRs for accidental secret exposure.

---

## Tips for Vibe Coding

- Start a Copilot Chat session and just describe what you want in plain English.
- Use `@senior-dev` for any significant feature or refactor.
- Use `@test-engineer` after implementing a new sim system.
- Enable `sequential-thinking` when working on complex AI/architecture decisions.
- Enable `sqlite` if you want Copilot to inspect the local `dev.db` schema while coding data migrations.

---

## Further Reading

- [GitHub Copilot Custom Agents](https://gh.io/customagents/config)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
