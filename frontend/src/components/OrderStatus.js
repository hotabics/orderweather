import React, { useState, useEffect } from 'react';
import { getOrder } from '../services/api';

const OrderStatus = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(orderId);
        setOrder(orderData);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return null;

  const getStatusMessage = () => {
    switch (order.status) {
      case 'pending':
        return 'Your order is confirmed! We will check the weather on the specified date.';
      case 'checking':
        return 'Currently checking the weather conditions...';
      case 'fulfilled':
        return '🎉 Great news! The weather conditions were met. Payment has been processed.';
      case 'not_fulfilled':
        return '☁️ Unfortunately, the weather conditions were not met. Your payment has been refunded.';
      case 'refunded':
        return 'Your payment has been refunded.';
      default:
        return 'Processing your order...';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="order-status">
      <h2>Order Status</h2>
      
      <div className="status-card">
        <div className={`status-badge ${order.status}`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </div>
        
        <p className="status-message">{getStatusMessage()}</p>

        <div className="order-details">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Location:</strong> {order.location.city}</p>
          <p><strong>Date:</strong> {formatDate(order.date)}</p>
          <p><strong>Amount:</strong> €{(order.amount / 100).toFixed(2)}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        </div>

        {order.weatherCheckResult && (
          <div className="weather-results">
            <h3>Weather Check Results</h3>
            <p><strong>Temperature:</strong> {order.weatherCheckResult.actualTemp}°C</p>
            <p><strong>Rain:</strong> {order.weatherCheckResult.hasRain ? 'Yes' : 'No'}</p>
            <p><strong>Checked At:</strong> {new Date(order.weatherCheckResult.checkedAt).toLocaleString()}</p>
            <p><strong>Conditions Met:</strong> {order.weatherCheckResult.fulfilled ? '✓ Yes' : '✗ No'}</p>
          </div>
        )}
      </div>

      <div className="conditions-info">
        <h3>Required Conditions</h3>
        <ul>
          <li>Temperature must be at least {order.weatherConditions.requiredTemp}°C</li>
          <li>No rain allowed</li>
        </ul>
      </div>
    </div>
  );
};

export default OrderStatus;
