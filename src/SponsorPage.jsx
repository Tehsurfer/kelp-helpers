import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key and session id logic
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test';
const VITE_REACT_APP_KH_BACKEND_URL = import.meta.env.VITE_REACT_APP_KH_BACKEND_URL 


const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function SponsorPage() {

  const createCheckoutSession = async () => {
    const stripe = await fetch(`{VITE_REACT_APP_KH_BACKEND_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: 'price_XXXXXXXXXXXXXXXXXXXXXXXX', // <-- Replace with your price id
        success_url: `${window.location.origin}/sponsor/success`,
        cancel_url: `${window.location.origin}/sponsor/cancel`,
        quantity: 1, // Adjust as needed
      }),
    }).then(response => response.json()).
    then(data => {
      if (!data || !data.id) {
        throw new Error('Failed to create checkout session');
      }
      return data;
    });
    return stripe;
  }


  const handleSponsorClick = async () => {
    const stripe = await stripePromise;
    const session = await createCheckoutSession();
    const sessionid = session.id;
    const { error } = await stripe.redirectToCheckout({ sessionid });
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <h2>Sponsor a Reef Tile</h2>
      <p>
        Thank you for supporting ocean restoration! Click the button below to proceed to secure payment.
      </p>
      <button
        onClick={handleSponsorClick}
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
        Sponsor Now
      </button>
    </div>
  );
}

export default SponsorPage;
