#!/bin/bash

# OrderWeather Development Startup Script
# Starts both backend and frontend in development mode

set -e

echo "🌤️  Starting OrderWeather in Development Mode"
echo "=============================================="
echo ""

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  MongoDB is not running."
        echo "Starting MongoDB with docker-compose..."
        docker-compose up -d
    else
        echo "✓ MongoDB is running"
    fi
elif command -v docker &> /dev/null; then
    echo "Starting MongoDB with docker-compose..."
    docker-compose up -d
else
    echo "⚠️  Cannot detect MongoDB. Make sure it's running."
fi

echo ""
echo "Starting services..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start backend
echo "📡 Starting backend on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
wait
