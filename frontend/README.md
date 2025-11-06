# OrderWeather Frontend

React frontend for OrderWeather application.

## Tech Stack

- **React** - UI library
- **Stripe React Elements** - Payment UI components
- **React DatePicker** - Date selection
- **React Toastify** - Notifications
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── OrderForm.js        # Order creation form
│   │   ├── PaymentForm.js      # Stripe payment form
│   │   └── OrderStatus.js      # Order status display
│   ├── services/
│   │   └── api.js              # API client
│   ├── App.js                  # Main app component
│   ├── App.css                 # Main styles
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
└── package.json
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_public_key
```

## Installation

```bash
npm install
```

## Running

### Development
```bash
npm start
```
Opens on http://localhost:3000

### Production Build
```bash
npm run build
```
Creates optimized build in `build/` directory

### Test
```bash
npm test
```

## Components

### OrderForm
- User inputs: email, date, city
- Validates date range (1-5 days)
- Creates order via API
- Navigates to payment on success

### PaymentForm
- Stripe payment UI
- Card input validation
- Payment confirmation
- Error handling

### OrderStatus
- Displays order details
- Shows weather check results
- Auto-refreshes every 30 seconds
- Status badges with colors

## Features

### Date Selection
- Minimum: Tomorrow
- Maximum: 5 days from now
- User-friendly date picker

### Payment Processing
- Stripe integration
- Test card support
- Error messages
- Success confirmation

### Order Tracking
- Real-time status updates
- Weather check results
- Payment status
- Refund information

## Styling

### Design System

**Colors:**
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (darker purple)
- Success: `#00b894` (green)
- Error: `#ff7675` (red)
- Warning: `#ffeaa7` (yellow)

**Status Colors:**
- Pending: Yellow
- Checking: Blue
- Fulfilled: Green
- Not Fulfilled: Red

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px
- Touch-friendly buttons
- Readable font sizes

## API Integration

All API calls are in `src/services/api.js`:

```javascript
import { createOrder, getOrder, getUserOrders } from './services/api';

// Create order
const result = await createOrder(orderData);

// Get order
const order = await getOrder(orderId);

// Get user orders
const orders = await getUserOrders(email);
```

## Stripe Integration

### Test Cards

Use these cards in development:

| Card Number         | Result              |
|---------------------|---------------------|
| 4242 4242 4242 4242 | Success             |
| 4000 0025 0000 3155 | 3D Secure required  |
| 4000 0000 0000 9995 | Declined            |

Use any future expiry, any 3-digit CVC, any postal code.

### Payment Flow

1. User fills order form
2. Backend creates payment intent
3. Frontend gets client secret
4. User enters card details
5. Stripe processes payment
6. Frontend confirms with backend

## Error Handling

All errors are displayed to users:
- Form validation errors
- API errors
- Payment errors
- Network errors

## State Management

Currently using React hooks:
- `useState` for local state
- `useEffect` for side effects
- Props for component communication

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Push to GitHub
2. Connect repo in Netlify
3. Set environment variables
4. Deploy

### Environment Variables
Don't forget to set:
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_STRIPE_PUBLIC_KEY` - Stripe public key

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Code splitting with React.lazy (can be added)
- Optimized production builds
- Minimal dependencies
- Efficient re-renders

## Accessibility

- Semantic HTML
- Form labels
- Keyboard navigation
- ARIA attributes (can be improved)

## Future Enhancements

- [ ] User authentication
- [ ] Order history page
- [ ] Email verification
- [ ] Password reset
- [ ] Profile management
- [ ] Multiple payment methods
- [ ] Order cancellation
- [ ] Weather statistics
- [ ] Social sharing
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)

## Common Issues

### Stripe Not Loading
- Check public key in `.env`
- Verify internet connection
- Check browser console for errors

### API Connection Failed
- Verify backend is running
- Check `REACT_APP_API_URL` in `.env`
- Check CORS settings in backend

### Build Errors
- Delete `node_modules` and reinstall
- Clear cache: `npm cache clean --force`
- Update Node.js to latest LTS

## Development Tips

1. Use React DevTools browser extension
2. Check Network tab for API calls
3. Use console.log for debugging
4. Test on multiple browsers
5. Test mobile responsiveness

## Testing

### Manual Testing Checklist
- [ ] Order form validation
- [ ] Date picker functionality
- [ ] City selection
- [ ] Payment form display
- [ ] Card validation
- [ ] Payment success flow
- [ ] Payment error handling
- [ ] Order status display
- [ ] Status auto-refresh
- [ ] Responsive design
- [ ] Error messages

### Automated Tests
```bash
npm test
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## License

ISC
