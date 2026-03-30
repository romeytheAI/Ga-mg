#!/bin/bash
# Script to create MaxVP GitHub Project using GraphQL API
# Usage: ./scripts/create-maxvp-project.sh <owner> [owner-type]
# owner-type: "user" (default) or "org"

set -e

OWNER="${1:-romeytheAI}"
OWNER_TYPE="${2:-user}"

if [ "$OWNER_TYPE" != "user" ] && [ "$OWNER_TYPE" != "org" ]; then
    echo "Error: owner-type must be 'user' or 'org'"
    exit 1
fi

echo "🚀 Creating MaxVP Project for ${OWNER_TYPE} ${OWNER}"
echo "=================================================="
echo ""

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN environment variable not set"
    echo "   Export your GitHub token with 'project' scope:"
    echo "   export GITHUB_TOKEN='your_token_here'"
    exit 1
fi

# Get owner ID
echo "📡 Fetching ${OWNER_TYPE} ID..."

if [ "$OWNER_TYPE" = "user" ]; then
    OWNER_ID=$(gh api graphql -f query='
        query($login: String!) {
            user(login: $login) {
                id
            }
        }
    ' -f login="$OWNER" --jq '.data.user.id')
else
    OWNER_ID=$(gh api graphql -f query='
        query($login: String!) {
            organization(login: $login) {
                id
            }
        }
    ' -f login="$OWNER" --jq '.data.organization.id')
fi

if [ -z "$OWNER_ID" ]; then
    echo "❌ Could not fetch ${OWNER_TYPE} ID for ${OWNER}"
    exit 1
fi

echo "✅ Owner ID: ${OWNER_ID}"

# Create project
echo ""
echo "🎯 Creating project..."

PROJECT_DATA=$(gh api graphql -f query='
    mutation($ownerId: ID!, $title: String!) {
        createProjectV2(input: {
            ownerId: $ownerId,
            title: $title
        }) {
            projectV2 {
                id
                number
                title
                url
            }
        }
    }
' -f ownerId="$OWNER_ID" -f title="MaxVP Agentic")

PROJECT_ID=$(echo "$PROJECT_DATA" | jq -r '.data.createProjectV2.projectV2.id')
PROJECT_NUMBER=$(echo "$PROJECT_DATA" | jq -r '.data.createProjectV2.projectV2.number')
PROJECT_URL=$(echo "$PROJECT_DATA" | jq -r '.data.createProjectV2.projectV2.url')

echo "✅ Project created!"
echo "   ID: ${PROJECT_ID}"
echo "   Number: ${PROJECT_NUMBER}"
echo "   URL: ${PROJECT_URL}"

# Create custom fields
echo ""
echo "🔧 Creating custom fields..."

# Priority field
echo "  Creating Priority field..."
gh api graphql -f query='
    mutation($projectId: ID!) {
        createProjectV2Field(input: {
            projectId: $projectId,
            dataType: SINGLE_SELECT,
            name: "Priority",
            singleSelectOptions: [
                {name: "P0 - Critical", color: RED},
                {name: "P1 - High", color: ORANGE},
                {name: "P2 - Medium", color: YELLOW},
                {name: "P3 - Low", color: GRAY}
            ]
        }) {
            projectV2Field {
                id
                name
            }
        }
    }
' -f projectId="$PROJECT_ID" > /dev/null

# Risk field
echo "  Creating Risk field..."
gh api graphql -f query='
    mutation($projectId: ID!) {
        createProjectV2Field(input: {
            projectId: $projectId,
            dataType: SINGLE_SELECT,
            name: "Risk",
            singleSelectOptions: [
                {name: "High", color: RED},
                {name: "Medium", color: YELLOW},
                {name: "Low", color: GREEN},
                {name: "None", color: GRAY}
            ]
        }) {
            projectV2Field {
                id
                name
            }
        }
    }
' -f projectId="$PROJECT_ID" > /dev/null

# Area field
echo "  Creating Area field..."
gh api graphql -f query='
    mutation($projectId: ID!) {
        createProjectV2Field(input: {
            projectId: $projectId,
            dataType: SINGLE_SELECT,
            name: "Area",
            singleSelectOptions: [
                {name: "projects", color: BLUE},
                {name: "codespaces", color: PURPLE},
                {name: "triage", color: PINK},
                {name: "cicd", color: GREEN},
                {name: "sim", color: ORANGE},
                {name: "docs", color: GRAY}
            ]
        }) {
            projectV2Field {
                id
                name
            }
        }
    }
' -f projectId="$PROJECT_ID" > /dev/null

# Owner field (text)
echo "  Creating Owner field..."
gh api graphql -f query='
    mutation($projectId: ID!) {
        createProjectV2Field(input: {
            projectId: $projectId,
            dataType: TEXT,
            name: "Owner"
        }) {
            projectV2Field {
                id
                name
            }
        }
    }
' -f projectId="$PROJECT_ID" > /dev/null

echo "✅ Custom fields created"

echo ""
echo "🎉 Success!"
echo "=========="
echo ""
echo "Your MaxVP project is ready at:"
echo "  ${PROJECT_URL}"
echo ""
echo "Project Number: ${PROJECT_NUMBER}"
echo ""
echo "Next steps:"
echo "1. Visit the project URL to configure views (Board, Table, Timeline)"
echo "2. Run the sync workflow to populate roadmap items:"
echo "   gh workflow run sync-agentic-roadmap.yml -f project-number=${PROJECT_NUMBER}"
echo "3. Check the workflow status:"
echo "   gh run list --workflow=sync-agentic-roadmap.yml"
echo ""
echo "💡 Tip: Save your project number for future syncs!"
