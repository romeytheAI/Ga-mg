# AGENTS.md

## Project Overview
Ga-mg (Gemini Agent Management Group) is a complex narrative and simulation engine built with React, Three.js, and Firebase. It focuses on immersive world-building, NPC behavior simulation, and autonomous narrative progression.

## Tech Stack
- **Frontend**: React 19 (Vite), Tailwind CSS 4, Framer Motion
- **Graphics**: Three.js
- **Backend/Storage**: Firebase (Firestore, Auth), SQLite (Better-SQLite3) for local state simulation
- **Language**: TypeScript
- **Testing**: Vitest, React Testing Library

## Code Conventions
- **Functional Patterns**: Prefers functional programming patterns (fp-ts style) for complex logic.
- **Components**: Atomic design, custom hooks for state logic.
- **Styling**: Vanilla CSS and Tailwind v4. Avoid ad-hoc utility classes in favor of defined tokens.
- **Naming**: Descriptive and consistent. Use PascalCase for components, camelCase for variables/functions.

## Persistence & State
- State is managed via a centralized simulation engine.
- World state involves complex narrative arcs, event flags, and epoch transitions.
- Local simulation uses SQLite for high-performance state tracking.

## Autonomous Learning (Jules-Specific)
This project maintains persistent learning logs for autonomous agents in the following directories:
- [`.jules/`](./.jules/): General architectural, performance, and security learnings.
- [`.Jules/`](./.Jules/): UI, accessibility, and design system standards.

**Jules Instructions:**
1. Before starting a task, read the latest entries in `.jules/` and `.Jules/` to avoid repeating past performance bottlenecks or accessibility failures.
2. If you discover a significant new architectural learning or prevent a vulnerability, document it in a new entry in the appropriate learning file.
3. Reference specific learning IDs or dates in your PR descriptions.

## Testing Requirements
- Unit tests are required for all new logic.
- Ensure narrative epoch transitions are tested for side effects.
- Coverage target: 80%+ for core simulation logic.

## Build & Test Commands
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm run test`
