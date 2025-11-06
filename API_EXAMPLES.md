# API Examples

This document contains example API calls for testing the OrderWeather API.

## Base URL
```
http://localhost:5000/api
```

## 1. Health Check

Check if the API is running:

```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "OrderWeather API is running"
}
```

## 2. Create Order

Create a new weather order:

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "date": "2025-11-08T12:00:00.000Z",
    "location": {
      "city": "Rīga",
      "lat": 56.9496,
      "lon": 24.1052
    },
    "amount": 1000
  }'
```

**Response:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "clientSecret": "pi_xxx_secret_xxx",
  "amount": 1000
}
```

## 3. Get Order Details

Retrieve a specific order:

```bash
curl http://localhost:5000/api/orders/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "user@example.com",
  "email": "user@example.com",
  "date": "2025-11-08T12:00:00.000Z",
  "location": {
    "city": "Rīga",
    "lat": 56.9496,
    "lon": 24.1052
  },
  "amount": 1000,
  "currency": "eur",
  "paymentIntentId": "pi_xxx",
  "paymentStatus": "pending",
  "status": "pending",
  "weatherConditions": {
    "requiredTemp": 20,
    "noRain": true
  },
  "createdAt": "2025-11-06T09:00:00.000Z",
  "updatedAt": "2025-11-06T09:00:00.000Z"
}
```

## 4. Get User Orders

Get all orders for a specific email:

```bash
curl "http://localhost:5000/api/orders?email=user@example.com"
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "date": "2025-11-08T12:00:00.000Z",
    "status": "pending",
    ...
  }
]
```

## 5. Confirm Payment

Confirm payment after Stripe payment completion:

```bash
curl -X POST http://localhost:5000/api/orders/507f1f77bcf86cd799439011/confirm
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed, waiting for weather verification",
  "order": {
    ...
  }
}
```

## Testing Payment Flow

### Using Stripe Test Cards

When testing with Stripe, use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

Use any future expiry date, any 3-digit CVC, and any postal code.

## Weather Conditions

Orders are checked against these conditions:
- Temperature must be ≥ 20°C
- No rain allowed (no weather descriptions containing "rain")

## Order Status Flow

1. **pending** - Order created, payment not yet completed
2. **checking** - Date has passed, checking weather
3. **fulfilled** - Weather conditions met, payment captured
4. **not_fulfilled** - Weather conditions not met, payment refunded
5. **refunded** - Payment has been refunded

## Payment Status Flow

1. **pending** - Payment intent created
2. **succeeded** - Payment authorized (held)
3. **refunded** - Payment cancelled/refunded
4. **failed** - Payment failed

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: email, date, location (city, lat, lon)"
}
```

### 404 Not Found
```json
{
  "error": "Order not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create order"
}
```

## Notes

- Dates must be between 1-5 days in the future (OpenWeatherMap forecast limitation)
- All dates should be in ISO 8601 format
- Amount is in cents (1000 = €10.00)
- The cron job runs every hour to check orders
