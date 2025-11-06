import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import OrderForm from './components/OrderForm';
import PaymentForm from './components/PaymentForm';
import OrderStatus from './components/OrderStatus';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

function App() {
  const [step, setStep] = useState('order'); // order, payment, status
  const [orderData, setOrderData] = useState(null);

  const handleOrderCreated = (data) => {
    setOrderData(data);
    setStep('payment');
    toast.success('Order created! Please complete payment.');
  };

  const handlePaymentSuccess = (orderId) => {
    setStep('status');
    toast.success('Payment successful! Your order is confirmed.');
  };

  const resetForm = () => {
    setStep('order');
    setOrderData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>☀️ OrderWeather</h1>
        <p className="tagline">Guarantee perfect weather for your special day!</p>
      </header>

      <main className="App-main">
        <div className="container">
          {step === 'order' && (
            <OrderForm onOrderCreated={handleOrderCreated} />
          )}

          {step === 'payment' && orderData && (
            <Elements stripe={stripePromise}>
              <PaymentForm
                clientSecret={orderData.clientSecret}
                orderId={orderData.orderId}
                amount={orderData.amount}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}

          {step === 'status' && orderData && (
            <div>
              <OrderStatus orderId={orderData.orderId} />
              <button onClick={resetForm} className="new-order-button">
                Create New Order
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>
          Powered by OpenWeatherMap & Stripe | Weather conditions: No rain, Temperature ≥20°C
        </p>
      </footer>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
