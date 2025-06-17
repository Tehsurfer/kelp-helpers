import React, { useState } from 'react';

function InfoPanel({ info, onClose, tileId, className }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://placehold.co/600x400/orange/white',
    'https://placehold.co/600x400/red/blue',
    'https://placehold.co/600x400/yellow/green'
  ];

  return (
    <div className={`info-panel${className ? ' ' + className : ''}`}>
      <button className="close-button" onClick={onClose}>&times;</button>
      <h2>Tile ID: {tileId}</h2>
      <p className="coordinates">Center: {info.lat.toFixed(4)}, {info.lng.toFixed(4)}</p>
      <span className="tag">Sponsored</span>
      <div className="spacer"></div>
      <p className="description">
        This is a placeholder paragraph describing the location. It can contain
        interesting facts, historical information, or any relevant details about
        the point of interest.
      </p>
      <div className="image-slider">
        <img src={images[currentImage]} alt={`Slide ${currentImage + 1}`} />
        <div className="slider-controls">
          <button onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}>&#10094;</button>
          <button onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}>&#10095;</button>
        </div>
      </div>
      <button className="action-button">Learn More</button>
    </div>
  );
}

export default InfoPanel;
