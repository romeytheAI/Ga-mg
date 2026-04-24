<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio App: Foundation & Architecture

This repository contains everything needed to run your app locally, structured for clear ownership and agentic workflows.

View your app in AI Studio: [https://ai.studio/apps/c27ece4c-b654-4b65-a8ce-77daecde924c](https://ai.studio/apps/c27ece4c-b654-4b65-a8ce-77daecde924c)

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   `npm run dev`

## Repository Structure & Folder Ownership

To help agents and contributors reason about the codebase, the project is structured as follows:

### Core Application (`src/`)
Contains all production application code.
*   **`src/components/`**: React view components and UI.
*   **`src/sim/`**: The core Simulation Layer. Contains the simulation engine, isolated game logic, systems, and fixed-timestep updates.
*   **`src/rendering/`**: The Rendering Layer. Handles canvas manipulation, high-fidelity vector components, and sprite compositing.
*   **`src/data/`**: Core game data, reference indexes, and definitions (e.g., DoL ports and Elder Scrolls content).
*   **`src/utils/`**: Shared utilities and helper functions.
*   **`src/state/`**: Global state configuration and persistence models.

### Assets & Static Content
*   **`public/`**: Authoritative directory for all static assets. Contains the `sprites/` hierarchy (e.g., `public/sprites/doll/`) for game rendering, SVGs, and other public resources. **Note: All image files must be placed within `public/` or their respective asset folders, not at the repository root.**
*   **`assets/`**: Additional non-public assets or raw resources.

### Ancillary Services & Experiments
*   **`revenue-sidecar/`**: A standalone Python DAFL (Distributed Autonomous Funding Layer) service with its own Dockerfile. This is a separate deployable module.
*   **`ga-mg-python/`**: Standalone full-stack Python clone/backend of the RPG, using FastAPI and SQLite.
*   **`project/`**: Experimental or utility scripts (e.g., `extract.js`, `test_worker.js`). Not part of the primary production build.

### Documentation (`docs/`)
Contains roadmaps, index specs, and architecture guidelines.

## Architecture Highlights
*   **Simulation Layer**: Handled in `src/sim/`, running game logic decoupled from the UI.
*   **Rendering Layer**: Handled via `src/rendering/` and React components, providing visual state without tight coupling to the simulation tick.
*   **Persistence Layer**: Governed by Firebase (see `firebase.ts` and `firestore.rules`), ensuring save state integrity.

## Foundation roadmap
- **Start here**: `docs/foundation-roadmap.md` - prerequisite issues for repository structure, type safety, performance, persistence, and CI/CD.
- These foundation issues should be completed before major feature work to ensure a stable, maintainable codebase.

## MaxVP agentic roadmap
- Roadmap: see `docs/agentic-roadmap.md` for the breakdown of automation sub-issues.

## AI reference index
- Character reference lookups for AI and developer workflows live in `src/data/characterReferenceIndex.ts`.
- Usage and maintenance guidance: `docs/character-reference-index.md`.
