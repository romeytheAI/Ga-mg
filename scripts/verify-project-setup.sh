#!/bin/bash
# Helper script to verify MaxVP project setup
# Usage: ./scripts/verify-project-setup.sh [project-number]

set -e

PROJECT_NUMBER="${1:-}"
REPO_OWNER="romeytheAI"
REPO_NAME="Ga-mg"

echo "🔍 MaxVP Project Setup Verification"
echo "===================================="
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "   Install from: https://cli.github.com/"
    exit 1
fi

echo "✅ GitHub CLI is installed"

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub"
    echo "   Run: gh auth login"
    exit 1
fi

echo "✅ Authenticated with GitHub"

# Check for project scope
if ! gh auth status 2>&1 | grep -q "project"; then
    echo "⚠️  GitHub CLI token missing 'project' scope"
    echo "   Run: gh auth refresh -s project"
    echo "   This is required to manage GitHub Projects"
fi

# Verify roadmap file exists
if [ ! -f "docs/agentic-roadmap.json" ]; then
    echo "❌ Roadmap file not found: docs/agentic-roadmap.json"
    exit 1
fi

echo "✅ Roadmap file exists"

# Count roadmap items
ITEM_COUNT=$(jq '.issues | length' docs/agentic-roadmap.json)
echo "📋 Found ${ITEM_COUNT} roadmap items"

# Verify workflow exists
if [ ! -f ".github/workflows/sync-agentic-roadmap.yml" ]; then
    echo "❌ Sync workflow not found"
    exit 1
fi

echo "✅ Sync workflow exists"

# If project number provided, verify it
if [ -n "$PROJECT_NUMBER" ]; then
    echo ""
    echo "🔍 Checking project #${PROJECT_NUMBER}..."

    # Try to list the project (requires project scope)
    if gh project view "$PROJECT_NUMBER" --owner "$REPO_OWNER" &> /dev/null; then
        echo "✅ Project #${PROJECT_NUMBER} exists and is accessible"

        # Show project info
        echo ""
        echo "Project Details:"
        gh project view "$PROJECT_NUMBER" --owner "$REPO_OWNER" --format json | jq -r '
            "  Title: \(.title)",
            "  URL: \(.url)",
            "  Items: \(.items | length)"
        '
    else
        echo "❌ Could not access project #${PROJECT_NUMBER}"
        echo "   Make sure:"
        echo "   1. The project number is correct"
        echo "   2. You have the 'project' scope: gh auth refresh -s project"
        echo "   3. The project belongs to ${REPO_OWNER}"
    fi
else
    echo ""
    echo "💡 To verify a specific project, run:"
    echo "   ./scripts/verify-project-setup.sh <project-number>"
fi

echo ""
echo "📖 Next Steps:"
echo "=============="
if [ -z "$PROJECT_NUMBER" ]; then
    echo "1. Create a project: https://github.com/users/${REPO_OWNER}/projects"
    echo "2. Follow setup guide: docs/maxvp-project-setup.md"
    echo "3. Run this script with your project number to verify"
    echo "4. Run the sync workflow to populate the project"
else
    echo "1. Review your project at the URL above"
    echo "2. Run the sync workflow to sync roadmap items:"
    echo "   gh workflow run sync-agentic-roadmap.yml -f project-number=${PROJECT_NUMBER}"
    echo "3. Check workflow status: gh run list --workflow=sync-agentic-roadmap.yml"
fi
