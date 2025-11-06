#!/bin/bash

# OrderWeather API Test Script
# Quick script to test API endpoints

API_URL="http://localhost:5000/api"

echo "🌤️  OrderWeather API Test Script"
echo "================================"
echo ""

# Test health endpoint
echo "1. Testing Health Endpoint..."
echo "GET $API_URL/health"
curl -s "$API_URL/health" | jq .
echo ""

# Test create order
echo "2. Testing Create Order..."
echo "POST $API_URL/orders"
ORDER_RESPONSE=$(curl -s -X POST "$API_URL/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "date": "'$(date -u -d '+2 days' +%Y-%m-%dT12:00:00.000Z)'",
    "location": {
      "city": "Rīga",
      "lat": 56.9496,
      "lon": 24.1052
    },
    "amount": 1000
  }')

echo "$ORDER_RESPONSE" | jq .
ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.orderId')
echo ""

if [ "$ORDER_ID" != "null" ] && [ -n "$ORDER_ID" ]; then
    echo "✅ Order created successfully!"
    echo "Order ID: $ORDER_ID"
    echo ""
    
    # Test get order
    echo "3. Testing Get Order..."
    echo "GET $API_URL/orders/$ORDER_ID"
    curl -s "$API_URL/orders/$ORDER_ID" | jq .
    echo ""
    
    # Test get user orders
    echo "4. Testing Get User Orders..."
    echo "GET $API_URL/orders?email=test@example.com"
    curl -s "$API_URL/orders?email=test@example.com" | jq .
    echo ""
else
    echo "❌ Failed to create order"
    exit 1
fi

echo "================================"
echo "✅ API tests completed!"
echo ""
