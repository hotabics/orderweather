# Quick Start Guide

This guide will help you get OrderWeather running on your local machine in minutes.

## Prerequisites

Make sure you have these installed:
- Node.js v16+ ([download](https://nodejs.org/))
- MongoDB ([download](https://www.mongodb.com/try/download/community)) or use Docker
- Git

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/hotabics/orderweather.git
cd orderweather
```

## Step 2: Start MongoDB (Choose one option)

### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

### Option B: Using Local MongoDB
```bash
# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

## Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/orderweather
OPENWEATHER_API_KEY=demo_key_for_testing
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
FRONTEND_URL=http://localhost:3000
EOF

# Start the backend server
npm run dev
```

The backend should now be running at http://localhost:5000

## Step 4: Setup Frontend (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
EOF

# Start the frontend
npm start
```

The app should automatically open at http://localhost:3000

## Step 5: Get API Keys (Required for Full Functionality)

### OpenWeatherMap API Key (Free)
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key
5. Update `OPENWEATHER_API_KEY` in `backend/.env`

### Stripe API Keys (Free Test Mode)
1. Visit https://stripe.com
2. Sign up for a free account
3. Go to Developers → API Keys
4. Copy both:
   - **Publishable key** (starts with `pk_test_`) → `REACT_APP_STRIPE_PUBLIC_KEY` in `frontend/.env`
   - **Secret key** (starts with `sk_test_`) → `STRIPE_SECRET_KEY` in `backend/.env`

## Testing the Application

### Test Card Numbers (Stripe Test Mode)
Use these cards for testing payments:

- **Success**: `4242 4242 4242 4242`
- **Requires 3D Secure**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

Use any future date for expiry, any 3 digits for CVC, and any postal code.

### Test Flow
1. Open http://localhost:3000
2. Fill in the order form:
   - Email: your-email@example.com
   - City: Rīga (or any available city)
   - Date: Select a date 1-5 days in the future
3. Click "Continue to Payment"
4. Enter test card details:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Postal: Any code (e.g., 12345)
5. Click "Pay Now"
6. You should see the order status page

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running. Check with:
```bash
# Using Docker
docker ps | grep mongo

# Using local MongoDB
ps aux | grep mongod
```

### Backend Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process using port 5000:
```bash
# On macOS/Linux
lsof -ti:5000 | xargs kill -9

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Can't Connect to Backend
**Check**:
1. Backend is running on port 5000
2. `REACT_APP_API_URL` in `frontend/.env` is correct
3. No CORS errors in browser console

### Stripe Payment Fails
**Check**:
1. You're using test API keys (not live keys)
2. Test card number is correct: `4242 4242 4242 4242`
3. `STRIPE_SECRET_KEY` is in `backend/.env`
4. `REACT_APP_STRIPE_PUBLIC_KEY` is in `frontend/.env`

## API Testing

You can test the API directly with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Create an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "date": "2025-11-10T12:00:00.000Z",
    "location": {
      "city": "Rīga",
      "lat": 56.9496,
      "lon": 24.1052
    }
  }'
```

See [API_EXAMPLES.md](./API_EXAMPLES.md) for more examples.

## Next Steps

- Review the [README.md](./README.md) for detailed documentation
- Check [API_EXAMPLES.md](./API_EXAMPLES.md) for API usage examples
- Customize weather conditions in `backend/src/models/Order.js`
- Add more cities in `frontend/src/components/OrderForm.js`
- Configure email notifications (future feature)

## Support

If you encounter issues:
1. Check the console logs (both backend and frontend)
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check API keys are valid
5. Open an issue on GitHub with error details

Happy weather ordering! ☀️
