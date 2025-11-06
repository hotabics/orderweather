const cron = require('node-cron');
const Order = require('../models/Order');
const weatherService = require('./weatherService');
const paymentService = require('./paymentService');

class CronService {
  /**
   * Initialize cron jobs
   */
  init() {
    // Run every hour to check for orders that need weather verification
    cron.schedule('0 * * * *', async () => {
      console.log('Running weather verification cron job...');
      await this.checkWeatherForOrders();
    });

    console.log('Cron jobs initialized');
  }

  /**
   * Check weather for orders and process payments
   */
  async checkWeatherForOrders() {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Find orders that are due for checking (date has passed but not checked yet)
      const ordersToCheck = await Order.find({
        date: { $lte: now, $gte: oneDayAgo },
        status: { $in: ['pending', 'checking'] },
        paymentStatus: 'succeeded'
      });

      console.log(`Found ${ordersToCheck.length} orders to check`);

      for (const order of ordersToCheck) {
        await this.verifyOrderWeather(order);
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  }

  /**
   * Verify weather for a specific order
   * @param {Object} order - Order document
   */
  async verifyOrderWeather(order) {
    try {
      console.log(`Checking weather for order ${order._id}`);
      
      order.status = 'checking';
      await order.save();

      // Get weather data
      const weatherData = await weatherService.getForecast(
        order.location.lat,
        order.location.lon,
        order.date
      );

      // Check if conditions are met
      const fulfilled = weatherService.checkConditions(
        weatherData,
        order.weatherConditions
      );

      // Update order with weather check results
      order.weatherCheckResult = {
        actualTemp: weatherData.temperature,
        hasRain: weatherData.hasRain,
        checkedAt: new Date(),
        fulfilled
      };

      if (fulfilled) {
        // Capture payment
        try {
          await paymentService.capturePayment(order.paymentIntentId);
          order.status = 'fulfilled';
          order.paymentStatus = 'succeeded';
          console.log(`Order ${order._id} fulfilled - payment captured`);
        } catch (error) {
          console.error(`Failed to capture payment for order ${order._id}:`, error);
          order.status = 'fulfilled';
        }
      } else {
        // Refund payment
        try {
          await paymentService.refundPayment(order.paymentIntentId);
          order.status = 'not_fulfilled';
          order.paymentStatus = 'refunded';
          console.log(`Order ${order._id} not fulfilled - payment refunded`);
        } catch (error) {
          console.error(`Failed to refund payment for order ${order._id}:`, error);
          order.status = 'not_fulfilled';
        }
      }

      await order.save();
    } catch (error) {
      console.error(`Error verifying weather for order ${order._id}:`, error);
      order.status = 'pending'; // Reset to pending for retry
      await order.save();
    }
  }

  /**
   * Manually trigger weather check for a specific order (for testing)
   * @param {string} orderId - Order ID
   */
  async manualCheck(orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    await this.verifyOrderWeather(order);
    return order;
  }
}

module.exports = new CronService();
