import React from 'react';
import { useTileContext } from './TileContext';
import { Link } from 'react-router-dom';

// Checkout URL is currently set to a test URL.
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_6oU9AM9674w1b1uaelf7i00"; 

function SponsorPage() {
  const { tileOfInterest } = useTileContext();


  if (tileOfInterest) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <h2>Sponsor a Reef Tile</h2>
        {tileOfInterest && (
          <div style={{ marginBottom: 16 }}>
            <strong>Tile:</strong> {tileOfInterest.name || tileOfInterest.id || 'Unknown'}
          </div>
        )}
        <p>
          Thank you for supporting ocean restoration! Click the button below to proceed to secure payment.
        </p>
        <p>
          {tileOfInterest.name} currently has a sponsorship level of {tileOfInterest.sponsorAmount || 0}%. Your contribution will help increase this level and support reef health.
        </p>
        <p>
          A sponshorship of ${100 - tileOfInterest.sponsorAmount || 0}.00 NZD will fully sponsor this tile.
        </p>
        <p>
          Your sponsorship will be the funding need to start restoration efforts on this hectare of reef, including monitoring, and restoration.
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
  else {
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
