const Order = require('../models/Order');
const paymentService = require('../services/paymentService');

/**
 * Create a new weather order
 */
exports.createOrder = async (req, res) => {
  try {
    const { email, date, location, amount } = req.body;

    // Validate required fields
    if (!email || !date || !location || !location.city || !location.lat || !location.lon) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, date, location (city, lat, lon)' 
      });
    }

    // Validate date is in the future
    const orderDate = new Date(date);
    const now = new Date();
    if (orderDate <= now) {
      return res.status(400).json({ 
        error: 'Order date must be in the future' 
      });
    }

    // Check if date is within forecast range (5 days)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    if (orderDate > maxDate) {
      return res.status(400).json({ 
        error: 'Order date must be within 5 days from now' 
      });
    }

    // Create payment intent
    const orderAmount = amount || 1000; // Default 10.00 EUR
    const paymentIntent = await paymentService.createPaymentIntent(
      orderAmount,
      'eur',
      {
        email,
        orderDate: orderDate.toISOString(),
        city: location.city
      }
    );

    // Create order
    const order = new Order({
      userId: email, // Using email as userId for simplicity
      email,
      date: orderDate,
      location,
      amount: orderAmount,
      paymentIntentId: paymentIntent.id,
      paymentStatus: 'pending'
    });

    await order.save();

    res.status(201).json({
      orderId: order._id,
      clientSecret: paymentIntent.client_secret,
      amount: orderAmount
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

/**
 * Get order by ID
 */
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
};

/**
 * Get all orders for a user (by email)
 */
exports.getUserOrders = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format to prevent injection
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get User Orders Error:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

/**
 * Confirm payment for an order
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get payment intent status
    const paymentIntent = await paymentService.getPaymentIntent(order.paymentIntentId);
    
    if (paymentIntent.status === 'requires_capture') {
      order.paymentStatus = 'succeeded';
      await order.save();
      
      res.json({ 
        success: true, 
        message: 'Payment confirmed, waiting for weather verification',
        order 
      });
    } else {
      res.status(400).json({ 
        error: 'Payment not ready for confirmation',
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Confirm Payment Error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};
