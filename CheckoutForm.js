// CheckoutForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name,
        email,
      },
    });

    if (error) {
      setError(error.message);
      setPaymentProcessing(false);
    } else {
      // Here you would send paymentMethod.id to your backend to process the payment
      // For the purpose of this example, we'll just simulate a successful payment
      setTimeout(() => {
        setPaymentSucceeded(true);
        setPaymentProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="container mt-5">
      {paymentSucceeded ? (
        <div className="alert alert-success" role="alert">
          Payment Successful!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Card Details</label>
            <CardElement className="form-control" />
          </div>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary btn-block mt-3"
            disabled={!stripe || paymentProcessing}
          >
            {paymentProcessing ? 'Processing...' : 'Pay'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
