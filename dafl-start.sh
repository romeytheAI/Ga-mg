#!/bin/bash

# DAFL Quick Start Script
# Launches the Distributed Autonomous Funding Layer

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         DAFL - Distributed Autonomous Funding Layer       ║"
echo "║              Revenue Sidecar Initialization               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found in root directory"
    echo "   Creating from .env.example..."
    cp .env.example .env 2>/dev/null || echo "VITE_SIDECAR_URL=http://localhost:8001" > .env
    echo "   ✅ Created .env file"
    echo ""
fi

# Check for sidecar .env file
if [ ! -f "revenue-sidecar/.env" ]; then
    echo "⚠️  No .env file found in revenue-sidecar/"
    if [ -f "revenue-sidecar/.env.example" ]; then
        echo "   Creating from .env.example..."
        cp revenue-sidecar/.env.example revenue-sidecar/.env
        echo "   ✅ Created revenue-sidecar/.env file"
    else
        echo "   ⚠️  Please create revenue-sidecar/.env manually"
    fi
    echo ""
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    🎉 DAFL is Running! 🎉                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Access Points:"
echo "   • Frontend:        http://localhost:3000"
echo "   • DAFL Dashboard:  http://localhost:3000/dafl"
echo "   • Sidecar API:     http://localhost:8001"
echo "   • API Docs:        http://localhost:8001/docs"
echo ""
echo "🔧 Useful Commands:"
echo "   • View logs:       docker-compose logs -f"
echo "   • Stop services:   docker-compose down"
echo "   • Restart:         docker-compose restart"
echo "   • Rebuild:         docker-compose up -d --build"
echo ""
echo "📈 Quick Actions:"
echo "   • Check metrics:   curl http://localhost:8001/metrics"
echo "   • Start sidecar:   curl -X POST http://localhost:8001/sidecar/start"
echo "   • Stop sidecar:    curl -X POST http://localhost:8001/sidecar/stop"
echo ""

# Optional: Start sidecar automatically
read -p "🤖 Start autonomous mode now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting autonomous mode..."
    sleep 2
    RESPONSE=$(curl -s -X POST http://localhost:8001/sidecar/start)
    echo "   Response: $RESPONSE"
    echo "   ✅ Sidecar is now autonomous!"
else
    echo "   ℹ️  You can start autonomous mode later via the dashboard or API"
fi

echo ""
echo "📚 Documentation:"
echo "   • Full Guide:      docs/DAFL-IMPLEMENTATION.md"
echo "   • Sidecar README:  revenue-sidecar/README.md"
echo ""
echo "🎮 Happy autonomous funding! 🚀"
