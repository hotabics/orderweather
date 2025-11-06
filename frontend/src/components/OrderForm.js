import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createOrder } from '../services/api';

const CITIES = [
  { name: 'Rīga', lat: 56.9496, lon: 24.1052 },
  { name: 'Liepāja', lat: 56.5046, lon: 21.0119 },
  { name: 'Daugavpils', lat: 55.8747, lon: 26.5361 },
  { name: 'Jelgava', lat: 56.6500, lon: 23.7167 },
  { name: 'Jūrmala', lat: 56.9677, lon: 23.7794 },
];

const OrderForm = ({ onOrderCreated }) => {
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate min and max dates once
  const minDate = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }, []);

  const maxDate = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !selectedDate || !selectedCity) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // Create order
      const orderData = {
        email,
        date: selectedDate.toISOString(),
        location: {
          city: selectedCity.name,
          lat: selectedCity.lat,
          lon: selectedCity.lon,
        },
        amount: 1000, // 10.00 EUR
      };

      const result = await createOrder(orderData);
      onOrderCreated(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form">
      <h2>Order Good Weather</h2>
      <p className="description">
        Select a date and location, and we'll guarantee good weather (no rain, temperature above 20°C).
        If the weather doesn't meet the conditions, you'll get a full refund!
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <select
            id="city"
            value={selectedCity.name}
            onChange={(e) => {
              const city = CITIES.find((c) => c.name === e.target.value);
              setSelectedCity(city);
            }}
            required
          >
            {CITIES.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select a date"
            required
          />
        </div>

        <div className="price-info">
          <strong>Price: €10.00</strong>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
