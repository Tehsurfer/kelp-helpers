import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

const educationItems = [
  {
    img: '/education-images/Trophic cycle.png',
    title: 'Trophic Cycle',
    desc: 'Kelp forests are vital underwater ecosystems that provide habitat and food for many marine species.' +
      ' They support a complex food web, from tiny plankton to large predators.' + 
      ' Understanding the trophic cycle is key to maintaining healthy kelp forests.',
  },
  {
    img: '/education-images/Trophic pyramid.png',
    title: 'Trophic Pyramid',
    desc: 'Due to a lack of predators, sea urchins can overgraze kelp forests if not kept in check, leading to "urchin barrens".' +
      ' The trophic pyramid illustrates the energy flow and predator-prey relationships in kelp ecosystems.'
  },
  {
    img: '/education-images/Process landscape white text.png',
    title: 'Kelp Helpers Restoration Process',
    desc: 'Kelp Helpers focuses on restoring kelp forests through community engagement, education, and active restoration projects.' +
      ' Our process includes assessing reef health, removing invasive species, and an innovative technique to process urchins into concret.',
  }
];

function EducationSection() {
  return (
    <div style={{ marginTop: 48, marginBottom: 32 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Learn About Kelp Forests
      </Typography>
      <Grid container spacing={2}>
        {educationItems.map((item, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="180"
                image={item.img}
                alt={item.title}
                sx={{
                  objectFit: 'contain',
                  background: 'rgb(21,88,124)', // deep ocean blue
                  p: 1,
                  width: '100%',
                  maxHeight: 200,
                }}
              />
              <CardContent>
                <Typography variant="subtitle1" component="div" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default EducationSection;
