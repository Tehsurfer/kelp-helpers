import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import EducationSection from './EducationSection';

function Home() {
  // Example educational content
  const educationItems = [
    {
      img: '/education-images/kelp-forest.jpg',
      title: 'Kelp Forests',
      desc: 'Kelp forests are vital underwater ecosystems that provide habitat and food for many marine species.',
    },
    {
      img: '/education-images/urchin.jpg',
      title: 'Sea Urchins',
      desc: 'Sea urchins can overgraze kelp forests if not kept in check, leading to "urchin barrens".',
    },
    {
      img: '/education-images/snapper.jpg',
      title: 'Snapper',
      desc: 'Snapper are important predators that help maintain the balance of reef ecosystems.',
    },
    {
      img: '/education-images/kelp-restoration.jpg',
      title: 'Kelp Restoration',
      desc: 'Restoration projects help regrow kelp forests and restore marine biodiversity.',
    },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        padding: 2, // mobile first
        fontSize: '1rem',
        backgroundColor: 'transparent',
        '@media (min-width:768px)': {
          padding: 4,
          fontSize: '1.25rem',
        },
        '@media (min-width:1200px)': {
          padding: 6,
          fontSize: '1.5rem',
        },
      }}
    >
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
        <source src="/wellington-reef.mp4" type="video/mp4" />
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
          {/* Educational section */}
          <EducationSection />
          {/* Testimonial section */}
          <Box sx={{ mt: 5, p: 3, bgcolor: '#f1f8e9', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Our Mission:
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              "To restore and protect our kelp forests through community engagement, education, and active restoration projects."
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              – Alex Radley, Founder
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
