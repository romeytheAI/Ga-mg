<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c27ece4c-b654-4b65-a8ce-77daecde924c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Foundation roadmap

- **Start here**: `docs/foundation-roadmap.md` - prerequisite issues for repository structure, type safety, performance, persistence, and CI/CD.
- These foundation issues should be completed before major feature work to ensure a stable, maintainable codebase.

## MaxVP agentic roadmap

- Roadmap: see `docs/agentic-roadmap.md` for the breakdown of automation sub-issues.
- To open/update the issues automatically, run the **Sync Agentic Roadmap** workflow and (optionally) supply your Projects V2 `project-number`.

## AI reference index

- Character reference lookups for AI and developer workflows live in `src/data/characterReferenceIndex.ts`.
- Usage and maintenance guidance: `docs/character-reference-index.md`.
