import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function Home() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          minWidth: '100vw',
          minHeight: '100vh',
          objectFit: 'cover',
          zIndex: -1, // <-- ensure video is always behind everything
        }}
      >
        <source src="../public/wellington-reef.mp4" type="video/mp4" />
        {/* Optionally add a webm/ogg fallback */}
      </video>
      {/* Content */}
      <Container
        maxWidth="sm"
        sx={{
          mt: 8,
          position: 'relative',
          zIndex: 1,
          // Optional: add a semi-transparent background for readability
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 2,
          boxShadow: 3,
          py: 4,
        }}
      >
    
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Kelp Helpers
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Welcome to the Kelp Helpers! This is a community-driven platform to help protect and restore kelp forests. Explore the map to find areas that need your support. 
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/map">
            Go to Map
          </Button>
          {/* Testimonial section */}
          <Box sx={{ mt: 5, p: 3, bgcolor: '#f1f8e9', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              What Our Supporters Say
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              "Thanks to Kelp Helpers, I learned so much about our local reefs and how to help protect them. The interactive map is fantastic!"
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              – Jamie, Community Volunteer
            </Typography>
          </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, mb: 2 }}>
        </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
