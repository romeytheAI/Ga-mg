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

## MaxVP Agentic Roadmap

The MaxVP initiative aims to build a fully agentic, automated development workflow using GitHub's full feature set.

### Getting Started

1. **Quick Setup (5 minutes)**: Follow [docs/maxvp-quickstart.md](docs/maxvp-quickstart.md) for automated project creation
2. **Detailed Setup**: Or see [docs/maxvp-project-setup.md](docs/maxvp-project-setup.md) for manual setup instructions
3. **Sync Roadmap Items**: Run the **Sync Agentic Roadmap** workflow with your project number
4. **Track Progress**: View the project board to see all MaxVP work items organized by priority and status

### Documentation

- **Quick Start Guide**: [docs/maxvp-quickstart.md](docs/maxvp-quickstart.md) - 5-minute automated setup
- **Project Setup Guide**: [docs/maxvp-project-setup.md](docs/maxvp-project-setup.md) - Complete setup instructions
- **Architecture Diagram**: [docs/maxvp-architecture.md](docs/maxvp-architecture.md) - System overview and integration points
- **Roadmap Overview**: [docs/agentic-roadmap.md](docs/agentic-roadmap.md) - Strategic breakdown of automation sub-issues
- **Roadmap Definition**: [docs/agentic-roadmap.json](docs/agentic-roadmap.json) - Machine-readable roadmap data
- **Implementation Summary**: [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) - What was delivered

### Automation Scripts

- **Create Project**: `./scripts/create-maxvp-project.sh` - Automatically create the GitHub project with all fields
- **Verify Setup**: `./scripts/verify-project-setup.sh` - Verify project configuration and roadmap sync status

### Project Board

Once set up, your project board will be available at:
- **User projects**: `https://github.com/users/romeytheAI/projects/{NUMBER}`
- **Org projects**: `https://github.com/orgs/{ORG}/projects/{NUMBER}`

Replace `{NUMBER}` with your project number after creation.
