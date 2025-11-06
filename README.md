# OrderWeather ☀️

Order weather is an app where everyone can order specific weather at a specific time and place.

## 📋 Overview

OrderWeather is a full-stack application that allows users to "order" good weather for a specific date and location. Users pay upfront, and if the weather conditions are met (no rain, temperature ≥20°C), the payment is captured. If the conditions are not met, the payment is automatically refunded.

### Features

- 🌤️ **Weather Ordering**: Select a date and location to order good weather
- 💳 **Stripe Payment Integration**: Secure payment processing with manual capture
- 🔍 **Weather Verification**: Automatic weather checking using OpenWeatherMap API
- 💰 **Automatic Refunds**: Money returned if weather conditions aren't met
- ⏰ **Cron Job Processing**: Scheduled weather checks and payment processing
- 📊 **Order Tracking**: Real-time order status updates

## 🏗️ Project Structure

```
orderweather/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (weather, payment, cron)
│   │   └── server.js          # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hotabics/orderweather.git
   cd orderweather
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your credentials
   ```

   Required environment variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/orderweather
   OPENWEATHER_API_KEY=your_openweather_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   FRONTEND_URL=http://localhost:3000
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your credentials
   ```

   Required environment variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```
   App will open on http://localhost:3000

## 🔑 API Keys Setup

### OpenWeatherMap API
1. Sign up at https://openweathermap.org/
2. Generate an API key
3. Add to backend `.env` file

### Stripe
1. Sign up at https://stripe.com/
2. Get your test API keys from the dashboard
3. Add both public and secret keys to respective `.env` files

## 📡 API Endpoints

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders?email=user@example.com` - Get user orders
- `POST /api/orders/:orderId/confirm` - Confirm payment

### Health Check
- `GET /api/health` - Check API status

## 🔄 How It Works

1. **User Orders Weather**
   - User selects date (1-5 days in future) and location
   - Creates payment intent with Stripe (manual capture)
   - Order stored in MongoDB with status "pending"

2. **Payment Processing**
   - User completes payment with credit card
   - Payment is authorized but not captured (held)
   - Order status updated to "succeeded"

3. **Weather Verification** (Cron Job runs hourly)
   - Checks orders where date has passed
   - Fetches actual weather from OpenWeatherMap
   - Compares with required conditions:
     - Temperature ≥ 20°C
     - No rain

4. **Payment Finalization**
   - **If conditions met**: Payment captured, order marked "fulfilled"
   - **If conditions not met**: Payment cancelled/refunded, order marked "not_fulfilled"

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Stripe** - Payment processing
- **Axios** - HTTP client
- **node-cron** - Task scheduling

### Frontend
- **React** - UI framework
- **Stripe React Elements** - Payment UI
- **React DatePicker** - Date selection
- **React Toastify** - Notifications
- **Axios** - API client

## 📝 MongoDB Schema

### Order Model
```javascript
{
  userId: String,
  email: String,
  date: Date,
  location: {
    city: String,
    lat: Number,
    lon: Number
  },
  amount: Number,
  currency: String,
  paymentIntentId: String,
  paymentStatus: String,
  weatherConditions: {
    requiredTemp: Number,
    noRain: Boolean
  },
  status: String,
  weatherCheckResult: {
    actualTemp: Number,
    hasRain: Boolean,
    checkedAt: Date,
    fulfilled: Boolean
  }
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend (e.g., Heroku)
1. Set environment variables
2. Deploy code
3. Ensure MongoDB is accessible
4. Cron jobs will run automatically

### Frontend (e.g., Vercel)
1. Set environment variables
2. Deploy code
3. Update backend CORS settings

## 📄 License

ISC

## 👥 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 🔒 Security Notes

- Never commit `.env` files
- Use environment variables for all sensitive data
- Stripe webhooks should be verified in production
- Implement rate limiting for production
- Add authentication/authorization for user-specific operations

## 📞 Support

For issues or questions, please open an issue on GitHub.
