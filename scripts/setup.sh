#!/bin/bash

# OrderWeather Setup Script
# This script helps set up the development environment

set -e

echo "🌤️  OrderWeather Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm $(npm --version) detected"

# Check if MongoDB is installed or Docker is available
if command -v mongod &> /dev/null; then
    echo "✓ MongoDB detected"
elif command -v docker &> /dev/null; then
    echo "✓ Docker detected (MongoDB can run via docker-compose)"
else
    echo "⚠️  MongoDB not detected. You'll need either:"
    echo "   - Local MongoDB installation"
    echo "   - Docker (to run MongoDB container)"
    echo "   - MongoDB Atlas connection string"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "Setting up environment files..."

# Setup backend .env
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your API keys"
else
    echo "✓ backend/.env already exists"
fi

# Setup frontend .env
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
    echo "⚠️  Please edit frontend/.env with your API keys"
else
    echo "✓ frontend/.env already exists"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys:"
echo "   - OPENWEATHER_API_KEY (from openweathermap.org)"
echo "   - STRIPE_SECRET_KEY (from stripe.com)"
echo ""
echo "2. Edit frontend/.env with your Stripe public key:"
echo "   - REACT_APP_STRIPE_PUBLIC_KEY"
echo ""
echo "3. Start MongoDB:"
echo "   - Via Docker: docker-compose up -d"
echo "   - Or use your local MongoDB installation"
echo ""
echo "4. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "5. Start the frontend (in another terminal):"
echo "   cd frontend && npm start"
echo ""
echo "📚 For more info, see QUICKSTART.md"
echo ""
