import React from 'react';

// Checkout URL is currently set to a test URL.
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_6oU9AM9674w1b1uaelf7i00"; 

function SponsorPage() {
  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <h2>Sponsor a Reef Tile</h2>
      <p>
        Thank you for supporting ocean restoration! Click the button below to proceed to secure payment.
      </p>
      <a
        href={STRIPE_CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
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
      </a>
    </div>
  );
}

export default SponsorPage;
