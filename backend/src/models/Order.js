const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    }
  },
  amount: {
    type: Number,
    required: true,
    default: 1000 // Amount in cents (10.00 EUR)
  },
  currency: {
    type: String,
    default: 'eur'
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'succeeded', 'refunded', 'failed'],
    default: 'pending'
  },
  weatherConditions: {
    requiredTemp: {
      type: Number,
      default: 20 // Temperature in Celsius
    },
    noRain: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'checking', 'fulfilled', 'not_fulfilled', 'refunded'],
    default: 'pending'
  },
  weatherCheckResult: {
    actualTemp: Number,
    hasRain: Boolean,
    checkedAt: Date,
    fulfilled: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
