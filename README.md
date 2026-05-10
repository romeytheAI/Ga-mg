<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c27ece4c-b654-4b65-a8ce-77daecde924c

## Run Locally

**Prerequisites:** Node.js 22

The repository uses `pnpm` exclusively. Never use `npm` or `yarn`.

1. Install dependencies:
   `pnpm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `pnpm run dev`

## GitHub Codespaces / Devcontainer

This repository supports GitHub Codespaces and devcontainers out of the box, providing a standardized Node.js 22 environment with `pnpm` pre-installed.

1. **Launch a Codespace**: Click the "Code" button on GitHub and select "Create codespace on main".
2. **Environment Variables**: To use the Gemini features, you need to expose your API key. In your GitHub Settings -> Codespaces -> Codespaces secrets, add a new secret named `GEMINI_API_KEY` with your API key, and assign it to this repository. The devcontainer will automatically pick this up.
3. Once the Codespace starts, all dependencies will be automatically installed via `pnpm install`, and you can start the development server by running:
   `pnpm run dev`
   (Port 3000 will be automatically forwarded).

## Foundation roadmap

- **Start here**: `docs/foundation-roadmap.md` - prerequisite issues for repository structure, type safety, performance, persistence, and CI/CD.
- These foundation issues should be completed before major feature work to ensure a stable, maintainable codebase.
- To open/update the issues automatically, run the **Sync Foundation Roadmap** workflow and (optionally) supply your Projects V2 `project-number`.

## MaxVP agentic roadmap

- Roadmap: see `docs/agentic-roadmap.md` for the breakdown of automation sub-issues.
- To open/update the issues automatically, run the **Sync Agentic Roadmap** workflow and (optionally) supply your Projects V2 `project-number`.

## AI reference index

- Character reference lookups for AI and developer workflows live in `src/data/characterReferenceIndex.ts`.
- Usage and maintenance guidance: `docs/character-reference-index.md`.
