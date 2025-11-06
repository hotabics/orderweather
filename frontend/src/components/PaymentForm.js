import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { confirmPayment } from '../services/api';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const PaymentForm = ({ clientSecret, orderId, amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Confirm the card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'requires_capture') {
        // Confirm with backend
        await confirmPayment(orderId);
        setSucceeded(true);
        onSuccess(orderId);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Complete Payment</h2>
      <p className="payment-info">
        Amount: <strong>€{(amount / 100).toFixed(2)}</strong>
      </p>
      <p className="payment-description">
        Your payment will be held and only charged if the weather conditions are met.
        Otherwise, you'll receive a full refund.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="card-element-wrapper">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        {error && <div className="error-message">{error}</div>}
        {succeeded && (
          <div className="success-message">
            Payment successful! Your order is being processed.
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading || succeeded}
          className="submit-button"
        >
          {loading ? 'Processing...' : succeeded ? 'Payment Complete' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
