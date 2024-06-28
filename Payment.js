// Payment.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Load your publishable API key from the Stripe Dashboard
const stripePromise = loadStripe('pk_test_51PWdu2JS7lNh0onm17d0i3AbPK4dvAsLH6jdOyBDXfnJnaBw2mcEEX8K83biLGmQ8CRxFxtJ4UwGBQSYsDnuPh7a00tGLOFNeM');

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;
