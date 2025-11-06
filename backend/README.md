# OrderWeather Backend

Node.js/Express backend for OrderWeather application.

## Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Stripe** - Payment processing
- **Axios** - HTTP client
- **node-cron** - Task scheduling

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── orderController.js   # Order route handlers
│   ├── models/
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   └── orderRoutes.js       # API routes
│   ├── services/
│   │   ├── cronService.js       # Cron job for weather checks
│   │   ├── paymentService.js    # Stripe payment logic
│   │   └── weatherService.js    # OpenWeatherMap API client
│   └── server.js                # Main application entry point
├── .env.example                 # Environment variables template
└── package.json
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/orderweather
OPENWEATHER_API_KEY=your_api_key
STRIPE_SECRET_KEY=sk_test_your_key
FRONTEND_URL=http://localhost:3000
```

## Installation

```bash
npm install
```

## Running

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders?email=user@example.com` - Get user orders
- `POST /api/orders/:orderId/confirm` - Confirm payment

## Services

### Weather Service (`weatherService.js`)

Handles OpenWeatherMap API integration:
- Fetches 5-day weather forecast
- Finds forecast closest to order date
- Checks if conditions are met

### Payment Service (`paymentService.js`)

Handles Stripe integration:
- Creates payment intents (manual capture)
- Captures payments (when weather is good)
- Refunds payments (when weather is bad)

### Cron Service (`cronService.js`)

Scheduled tasks:
- Runs every hour
- Checks orders where date has passed
- Verifies weather conditions
- Processes payments accordingly

## Models

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
  paymentStatus: String,  // pending, succeeded, refunded, failed
  weatherConditions: {
    requiredTemp: Number,
    noRain: Boolean
  },
  status: String,  // pending, checking, fulfilled, not_fulfilled, refunded
  weatherCheckResult: {
    actualTemp: Number,
    hasRain: Boolean,
    checkedAt: Date,
    fulfilled: Boolean
  }
}
```

## Error Handling

All routes include error handling:
- 400 - Bad Request (missing fields, invalid data)
- 404 - Not Found (order not found)
- 500 - Internal Server Error (database, API errors)

## Testing

```bash
npm test
```

## Deployment Considerations

1. **Environment Variables**: Set all required env vars
2. **MongoDB**: Use MongoDB Atlas or other cloud provider
3. **Stripe Webhooks**: Configure for production
4. **CORS**: Update allowed origins
5. **Rate Limiting**: Implement for production
6. **Logging**: Use proper logging service
7. **Error Monitoring**: Integrate Sentry or similar

## API Rate Limits

### OpenWeatherMap Free Tier
- 60 calls/minute
- 1,000,000 calls/month

### Stripe
- No rate limits for most operations
- Webhook retries: 3 days

## Security Notes

- Never commit `.env` file
- Use environment variables for all secrets
- Validate all input data
- Implement authentication in production
- Use HTTPS in production
- Implement rate limiting
- Sanitize database queries

## Common Issues

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network connectivity

### Stripe Payment Failed
- Verify API keys are correct
- Check if using test keys for development
- Ensure payment intent is properly created

### Weather API Error
- Verify API key is valid
- Check if API quota is exceeded
- Ensure date is within 5-day forecast range

## Development Tips

1. Use `nodemon` for auto-reload during development
2. Check MongoDB data with MongoDB Compass
3. Test Stripe payments with test cards
4. Use Postman/curl for API testing
5. Monitor console logs for errors

## Future Enhancements

- [ ] User authentication
- [ ] WebSocket for real-time updates
- [ ] Email notifications
- [ ] Webhook for Stripe events
- [ ] Order cancellation
- [ ] Custom weather conditions
- [ ] Multiple payment methods
- [ ] Admin API endpoints
