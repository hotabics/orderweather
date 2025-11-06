# OrderWeather Architecture

## System Overview

OrderWeather is a full-stack web application that allows users to purchase guaranteed weather conditions for specific dates and locations. If the weather meets the promised conditions, the payment is captured; otherwise, it's refunded.

## High-Level Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Port 3000)    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐      ┌──────────────┐
│  Express.js     │◄────►│  MongoDB     │
│  Backend API    │      │  Database    │
│  (Port 5000)    │      └──────────────┘
└────────┬────────┘
         │
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ Stripe  │ │ OpenWeather  │
│ API     │ │ Map API      │
└─────────┘ └──────────────┘
```

## Component Architecture

### Frontend (React)

```
App.js (Main Container)
├── OrderForm (Step 1: Create Order)
│   ├── Email Input
│   ├── Date Picker
│   └── City Selector
│
├── PaymentForm (Step 2: Payment)
│   ├── Stripe Elements
│   │   └── Card Input
│   └── Submit Button
│
└── OrderStatus (Step 3: Status)
    ├── Order Details
    ├── Weather Results
    └── Payment Status
```

### Backend (Node.js/Express)

```
server.js (Entry Point)
├── Routes
│   └── /api/orders
│       ├── POST /          (Create Order)
│       ├── GET /:id        (Get Order)
│       ├── GET /           (List Orders)
│       └── POST /:id/confirm (Confirm Payment)
│
├── Controllers
│   └── orderController.js
│       └── Business logic handlers
│
├── Services
│   ├── weatherService.js
│   │   ├── getForecast()
│   │   └── checkConditions()
│   │
│   ├── paymentService.js
│   │   ├── createPaymentIntent()
│   │   ├── capturePayment()
│   │   └── refundPayment()
│   │
│   └── cronService.js
│       ├── init()
│       └── checkWeatherForOrders()
│
└── Models
    └── Order.js (MongoDB Schema)
```

## Data Flow

### 1. Order Creation Flow

```
User → OrderForm → Backend API → MongoDB
                        ↓
                   Stripe API
                        ↓
                   Payment Intent
                        ↓
                   Frontend (clientSecret)
```

**Steps:**
1. User fills order form (email, date, city)
2. Frontend validates input
3. Frontend sends POST request to `/api/orders`
4. Backend validates data
5. Backend creates Stripe payment intent (manual capture)
6. Backend saves order to MongoDB
7. Backend returns order ID and client secret
8. Frontend stores order data and proceeds to payment

### 2. Payment Flow

```
User → PaymentForm → Stripe.js → Stripe API
                         ↓
                    Payment Success
                         ↓
                    Backend API
                         ↓
                    Update MongoDB
```

**Steps:**
1. User enters card details
2. Stripe.js validates card
3. Stripe.js confirms payment with Stripe API
4. Payment is authorized (held, not captured)
5. Frontend receives payment confirmation
6. Frontend calls `/api/orders/:id/confirm`
7. Backend updates order status to "succeeded"
8. Frontend shows success message

### 3. Weather Verification Flow (Cron Job)

```
Cron Schedule → cronService → MongoDB (find orders)
                    ↓
              OpenWeather API
                    ↓
           Check Conditions
               ↓         ↓
         Fulfilled    Not Fulfilled
               ↓         ↓
         Capture      Refund
          Payment     Payment
               ↓         ↓
        Update Order Status
```

**Steps:**
1. Cron job runs every hour
2. Finds orders where date has passed
3. For each order:
   - Fetch weather data from OpenWeatherMap
   - Compare actual vs required conditions
   - If fulfilled: capture payment
   - If not fulfilled: refund payment
   - Update order with results
4. Save updated order to database

## Database Schema

### Order Document

```javascript
{
  _id: ObjectId,
  userId: String,
  email: String,
  date: ISODate,
  location: {
    city: String,
    lat: Number,
    lon: Number
  },
  amount: Number,              // Amount in cents
  currency: String,            // e.g., "eur"
  paymentIntentId: String,     // Stripe payment intent ID
  paymentStatus: String,       // pending | succeeded | refunded | failed
  weatherConditions: {
    requiredTemp: Number,      // Minimum temperature in Celsius
    noRain: Boolean           // Whether rain is allowed
  },
  status: String,              // pending | checking | fulfilled | not_fulfilled
  weatherCheckResult: {
    actualTemp: Number,
    hasRain: Boolean,
    checkedAt: ISODate,
    fulfilled: Boolean
  },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## API Endpoints

### REST API

| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| GET    | `/api/health`             | Health check          |
| POST   | `/api/orders`             | Create new order      |
| GET    | `/api/orders/:id`         | Get order details     |
| GET    | `/api/orders?email=X`     | Get user orders       |
| POST   | `/api/orders/:id/confirm` | Confirm payment       |

## External Service Integration

### Stripe Payment Processing

**Purpose:** Handle payments with manual capture

**Flow:**
1. Create payment intent (authorize)
2. Hold payment for up to 7 days
3. Capture payment if weather conditions met
4. Cancel payment intent if not met

**Why Manual Capture?**
- Allows holding payment until weather is verified
- Automatic refund if conditions not met
- Better user experience

### OpenWeatherMap API

**Purpose:** Get weather forecasts and verify conditions

**Limitations:**
- Free tier: 60 calls/min, 1M calls/month
- Forecast range: 5 days
- Data updates: Every 3 hours

**API Used:**
- 5-day forecast endpoint
- Returns weather data every 3 hours
- Finds closest timestamp to order date

## Security Considerations

### Authentication & Authorization
- **Current:** No authentication (email-based)
- **Future:** Implement JWT tokens or OAuth

### Data Protection
- Environment variables for secrets
- No sensitive data in logs
- HTTPS in production
- Input validation on all endpoints

### Payment Security
- Stripe handles card data (PCI compliant)
- No card details stored in database
- Payment intents expire after 24 hours
- Webhook signature verification (future)

## Scalability Considerations

### Current Limitations
- Single server instance
- Cron runs on single instance
- No caching layer
- No queue system

### Future Improvements

**Horizontal Scaling:**
- Load balancer for multiple backend instances
- Distributed cron with leader election
- Redis for session management

**Performance:**
- Implement caching (Redis)
- Database indexing
- CDN for frontend
- API rate limiting

**Reliability:**
- Message queue (Bull, RabbitMQ)
- Separate worker for weather checks
- Webhook retry mechanism
- Error monitoring (Sentry)

## Deployment Architecture

### Development
```
Local Machine
├── MongoDB (localhost:27017)
├── Backend (localhost:5000)
└── Frontend (localhost:3000)
```

### Production (Example)
```
Frontend (Vercel/Netlify)
     ↓ HTTPS
Backend (Heroku/Railway)
     ↓
MongoDB Atlas (Cloud)
     +
Stripe API
     +
OpenWeatherMap API
```

## Error Handling

### Frontend
- Form validation errors
- API error messages
- Payment failure handling
- Network error retry

### Backend
- Try-catch on all async operations
- Specific error messages
- HTTP status codes
- Error logging

### Cron Job
- Continue on individual order failures
- Log all errors
- Retry logic for transient failures
- Alert on repeated failures (future)

## Monitoring & Logging

### Current
- Console logs
- Express error middleware
- Client-side error boundaries (can be added)

### Future
- Structured logging (Winston, Pino)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (UptimeRobot)
- Analytics (Google Analytics, Mixpanel)

## Testing Strategy

### Unit Tests
- Service functions
- Utility functions
- React components

### Integration Tests
- API endpoints
- Database operations
- External service mocks

### E2E Tests
- Complete user flows
- Payment processing
- Weather verification

## Technology Choices

### Why React?
- Component-based architecture
- Large ecosystem
- Easy state management
- Good developer experience

### Why Express?
- Lightweight
- Flexible
- Large middleware ecosystem
- Easy to learn

### Why MongoDB?
- Flexible schema
- Good for rapid development
- Easy to scale
- JSON-like documents

### Why Stripe?
- Best payment UX
- Excellent documentation
- Manual capture support
- Test mode

### Why OpenWeatherMap?
- Free tier available
- Good documentation
- Reliable service
- 5-day forecast

## Future Enhancements

1. **User Management**
   - User registration/login
   - Order history
   - User profiles

2. **Email Notifications**
   - Order confirmation
   - Payment captured/refunded
   - Weather check results

3. **Admin Dashboard**
   - View all orders
   - Manual weather checks
   - System statistics

4. **Advanced Features**
   - Multiple weather providers
   - Custom weather conditions
   - Group orders
   - Subscription model

5. **Mobile App**
   - React Native app
   - Push notifications
   - Location-based features

## Conclusion

OrderWeather is designed as a modern, scalable web application with clear separation of concerns, robust error handling, and room for future growth. The architecture supports the core business logic while maintaining flexibility for enhancements.
