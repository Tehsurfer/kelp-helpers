import React, { useState } from 'react';
import coastlineTiles from './data/coastline-tiles-with-data.json'
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Carousel from 'react-material-ui-carousel';

function InfoPanel({ info, onClose, tileId, className }) {
  const [currentImage, setCurrentImage] = useState(0);

  // Get info for the tile
  function getTileInfo(tileId) {
    return coastlineTiles.find(tile => tile.id === tileId) || {};
  }

  const tileInfo = getTileInfo(tileId);
  const reefHealth = tileInfo.reefHealth ?? 0;
  const sponsorship = tileInfo.sponsorAmount ?? 0; // 0 to 1

  const images = [
    'https://placehold.co/600x400/orange/white',
    'https://placehold.co/600x400/red/blue',
    'https://placehold.co/600x400/yellow/green'
  ];

  return (
    <div className={`info-panel${className ? ' ' + className : ''}`}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <h2>{tileInfo.name || 'Unknown Location'}</h2>
      <p className="coordinates">Center: {info.lat.toFixed(4)}, {info.lng.toFixed(4)}</p>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          sx={{
            fontWeight: 'bold',
            px: 2,
            borderRadius: 1,
            minWidth: 0,
          }}
        >
          Sponsorship
        </Button>
        <Box sx={{ flex: 1, minWidth: 60 }}>
          <LinearProgress
            variant="determinate"
            value={sponsorship}
            sx={{
              height: 8,
              borderRadius: 4,
              [`& .MuiLinearProgress-bar`]: {
                backgroundColor: '#1976d2',
              },
              backgroundColor: '#e3e3e3',
            }}
          />
        </Box>
        <span style={{ minWidth: 32, fontSize: 13, marginLeft: 6 }}>
          {Math.floor(sponsorship)}%
        </span>
      </Box>
      <div className="spacer"></div>
      
      <Box sx={{ width: '100%', mb: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Reef Health</span>
          <span>{Math.floor(reefHealth*100)}%</span>
        </div>
        <LinearProgress
          variant="determinate"
          value={reefHealth*100}
          sx={{
            height: 10,
            borderRadius: 5,
            [`& .MuiLinearProgress-bar`]: {
              backgroundColor: reefHealth >= 0.3 ? 'green' : 'red',
            },
            backgroundColor: '#eee',
          }}
        />
      </Box>
      <p className="description">
        This is a placeholder paragraph describing the location. It can contain
        interesting facts, historical information, or any relevant details about
        the point of interest.
      </p>
      <p className="reef-health">
        Urchins estimated: {tileInfo.urchinsEstimated || 'N/A'} |
        Kelp estimated: {tileInfo.kelpEstimated || 'N/A'} |
        Snapper estimated: {tileInfo.snapperEstimated || 'N/A'}
      </p>
      
      {/* Replace image-slider with Material UI Carousel */}
      <Box sx={{ my: 2 }}>
        <Carousel
          navButtonsAlwaysVisible
          indicators={false}
          autoPlay={false}
          sx={{ borderRadius: 2, overflow: 'hidden' }}
        >
          {images.map((src, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, bgcolor: '#fafafa' }}>
              <img src={src} alt={`Slide ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'cover' }} />
            </Box>
          ))}
        </Carousel>
      </Box>
      <button className="action-button">Learn More</button>
    </div>
  );
}

export default InfoPanel;
