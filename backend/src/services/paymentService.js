const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  /**
   * Create a payment intent
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Payment intent
   */
  async createPaymentIntent(amount, currency, metadata) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        capture_method: 'manual' // Hold the payment for later capture
      });

      return paymentIntent;
    } catch (error) {
      console.error('Payment Intent Creation Error:', error.message);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Capture a payment (when weather conditions are met)
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Updated payment intent
   */
  async capturePayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Payment Capture Error:', error.message);
      throw new Error('Failed to capture payment');
    }
  }

  /**
   * Refund a payment (when weather conditions are not met)
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Refund object
   */
  async refundPayment(paymentIntentId) {
    try {
      // Cancel the payment intent if not captured yet
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Payment Refund Error:', error.message);
      throw new Error('Failed to refund payment');
    }
  }

  /**
   * Get payment intent details
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment intent details
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Payment Retrieval Error:', error.message);
      throw new Error('Failed to retrieve payment intent');
    }
  }
}

module.exports = new PaymentService();
