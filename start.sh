#!/bin/bash
echo "🚀 Starting NEXUS Store..."
echo ""

# Start backend
echo "[1/2] Starting Backend (port 5000)..."
cd backend && npm install && npm run dev &
BACKEND_PID=$!

sleep 2

# Start frontend
echo "[2/2] Starting Frontend (port 5173)..."
cd ../frontend && npm install && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Store running at: http://localhost:5173"
echo "✅ Admin panel at:   http://localhost:5173/admin"
echo ""
echo "Press Ctrl+C to stop both servers"

wait $BACKEND_PID $FRONTEND_PID
