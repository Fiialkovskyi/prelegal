#!/bin/bash

echo "🛑 Stopping Prelegal services..."

# Kill any existing uvicorn processes
pkill -f "uvicorn app.main:app" 2>/dev/null || true

# Kill any existing next dev processes
pkill -f "next dev" 2>/dev/null || true

# Kill any bash processes started by start-linux.sh
pkill -f "start-linux.sh" 2>/dev/null || true

echo "👋 Prelegal services stopped"
