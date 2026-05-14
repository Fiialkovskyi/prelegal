#!/bin/bash

set -e

echo "🚀 Starting Prelegal (Linux)..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( dirname "$SCRIPT_DIR" )"

cd "$PROJECT_DIR"

# Create and activate virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install backend dependencies if needed
if [ ! -f "backend/.deps_installed" ]; then
    echo "📦 Installing backend dependencies..."
    pip install -q -r backend/requirements.txt
    touch backend/.deps_installed
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install -q && cd ..
fi

# Start backend in background
echo "▶️  Starting FastAPI backend on http://localhost:8000..."
(cd backend && uvicorn app.main:app --reload) &
BACKEND_PID=$!

# Give backend time to start
sleep 2

# Start frontend
echo "▶️  Starting Next.js frontend on http://localhost:3000..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are running!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Handle graceful shutdown
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '👋 Servers stopped'; exit 0" SIGINT

# Wait for both processes
wait
