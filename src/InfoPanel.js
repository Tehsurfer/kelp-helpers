import React, { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router-dom';
import { useTileContext } from './TileContext';
import './Infopanel.css';

function InfoPanel({ info, onClose, tileId, className, tilesData, loading, error }) {
  const [currentImage, setCurrentImage] = useState(0);
  const { setTileOfInterest } = useTileContext();

  // Get info for the tile
  function getTileInfo(tileId) {
    if (!tilesData) return {};
    return tilesData.find(tile => tile.id === tileId) || {};
  }

  if (loading) return <div className={`info-panel${className ? ' ' + className : ''}`}>Loading...</div>;
  if (error) return <div className={`info-panel${className ? ' ' + className : ''}`}>Error loading data.</div>;

  const tileInfo = getTileInfo(tileId);
  const reefHealth = Number(tileInfo.reefHealth ?? 0);
  // Ensure sponsorship is a number between 0 and 100
  const sponsorship = Number(tileInfo.sponsorAmount ?? 0);

  const handleSponsorClick = () => {
    setTileOfInterest(tileInfo);
  };

  return (
    <div className={`info-panel${className ? ' ' + className : ''}`}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <h2>{tileInfo.name || 'Unknown Location'}</h2>
      <p className="coordinates">Center: {info.lat.toFixed(4)}, {info.lng.toFixed(4)}</p>
      
      <Box className="sponsorship-row">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          className="sponsorship-button"
          component={Link}
          to="/sponsor"
          onClick={handleSponsorClick}
        >
          Sponsorship
        </Button>
        <Box className="sponsorship-progress-box">
          <LinearProgress
            variant="determinate"
            value={sponsorship}
            className="sponsorship-progress"
          />
        </Box>
        <span className='sponsorship-percentage'>
          {Math.floor(sponsorship)}%
        </span>
      </Box>
      <div className="spacer"></div>
      
      <Box className="reef-health-box">
        <div className="reef-health-row">
          <span>Reef Health</span>
          <span>{Math.floor(reefHealth*100)}%</span>
        </div>
        <LinearProgress
          variant="determinate"
          value={reefHealth*100}
          className={`reef-health-progress${reefHealth >= 0.3 ? ' healthy' : ' unhealthy'}`}
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
      <Box className="carousel-box">
        <Carousel
          navButtonsAlwaysVisible
          indicators={false}
          autoPlay={false}
          className="carousel-root"
        >
          {(tileInfo.images || []).map((src, idx) => (
            <Box key={idx} className="carousel-image-box">
              <img src={src} alt={`Slide ${idx + 1}`} className="carousel-image" />
            </Box>
          ))}
        </Carousel>
      </Box>
      <button className="action-button">Learn More</button>
    </div>
  );
}

export default InfoPanel;