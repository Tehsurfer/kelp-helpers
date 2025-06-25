import React, { useEffect, useState } from 'react';
import { useTileContext } from './TileContext';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements, CheckoutProvider } from '@stripe/react-stripe-js';

const stripePublicKey = import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY
const apiBase = import.meta.env.VITE_REACT_APP_KH_API_URL || 'http://localhost:5000';
const stripePromise = loadStripe(stripePublicKey);

function CheckoutForm({ clientSecret, amount, tileOfInterest }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: {
            name: tileOfInterest?.name || 'Anonymous',
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Payment successful! Thank you for your sponsorship.');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        style={{
          display: "inline-block",
          background: "#635bff",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: 8,
          fontWeight: "bold",
          fontSize: "1.1rem",
          textDecoration: "none",
          marginTop: 24,
          border: "none",
          cursor: "pointer"
        }}
      >
        {submitting ? 'Processing...' : `Sponsor Now (${amount} NZD)`}
      </button>
      {message && <div style={{ marginTop: 16, color: 'green' }}>{message}</div>}
    </form>
  );
}

function SponsorPage() {
  const { tileOfInterest } = useTileContext();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate amount to sponsor (in NZD)
  const amount = tileOfInterest ? 100 - (tileOfInterest.sponsorAmount || 0) : 100;

  useEffect(() => {
    if (!tileOfInterest) return;
    setLoading(true);
    // Call Kelp Helpers API to create a payment intent

    fetch(`${apiBase}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount * 100, tileName: tileOfInterest.name }), // amount in cents
    })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.client_secret);
        console.log('Payment intent created:', data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tileOfInterest]);

  if (tileOfInterest) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <h2>Sponsor a Reef Tile</h2>
        <div style={{ marginBottom: 16 }}>
          <strong>Tile:</strong> {tileOfInterest.name || tileOfInterest.id || 'Unknown'}
        </div>
        <p>
          Thank you for supporting ocean restoration! Complete the payment below to sponsor this tile.
        </p>
        <p>
          {tileOfInterest.name} currently has a sponsorship level of {tileOfInterest.sponsorAmount || 0}%. Your contribution will help increase this level and support reef health.
        </p>
        <p>
          A sponsorship of ${amount}.00 NZD will fully sponsor this tile.
        </p>
        {loading && <div>Loading payment form...</div>}
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} amount={amount} tileOfInterest={tileOfInterest} />
          </Elements>
        )}
      </div>
    );
  } else {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <h2>Thanks for your interest in sponsoring a tile!</h2>
        <p>Please select a tile on the <Link to="/map">map</Link> to sponsor.</p>
        <Link
          to="/map"
          style={{
            display: "inline-block",
            background: "#635bff",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: 8,
            fontWeight: "bold",
            fontSize: "1.1rem",
            textDecoration: "none",
            marginTop: 24,
            border: "none",
            cursor: "pointer"
          }}
        >
          Go to Map
        </Link>
      </div>
    );
  }
}

export default SponsorPage;
