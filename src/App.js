import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const dataGateWayURL = process.env.REACT_APP_DATA_GATEWAY_URL;

const makeApiRequest = async (payload) => {
  try {
    const queryString = new URLSearchParams(payload).toString();
    const urlWithParams = `${dataGateWayURL}?${queryString}`;
    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Helper to create 100m x 100m grid in degrees
function generateGrid(bounds, spacing = 100) {
  const features = [];
  const earthRadius = 6378137;

  const meterInDegree = (meters) => meters / (2 * Math.PI * earthRadius) * 360;
  const spacingDegLat = meterInDegree(spacing);
  const spacingDegLng = meterInDegree(spacing);
  var count = 0;

  for (let lat = bounds.getSouth(); lat < bounds.getNorth(); lat += spacingDegLat) {
    for (let lng = bounds.getWest(); lng < bounds.getEast(); lng += spacingDegLng) {
      const polygon = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [lng, lat],
            [lng + spacingDegLng, lat],
            [lng + spacingDegLng, lat + spacingDegLat],
            [lng, lat + spacingDegLat],
            [lng, lat]
          ]]
        },
        properties: {
          id: `T${String(count + 1).padStart(6, '0')}`
        }
      };
      features.push(polygon);
      count++;
    }
  }

  return {
    type: 'FeatureCollection',
    features
  };
}

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(174.9690922595569);
  const [lat, setLat] = useState(-36.69274459161924);
  const [zoom, setZoom] = useState(14);
  const [popupInfo, setPopupInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState(null);
  const [gridData, setGridData] = useState(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setPopupInfo(null);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    makeApiRequest({ action: 'test', user: '123' });
  }, []);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: 60, // Tilt the map for isometric view
      bearing: -17.6 // Optional: rotate for a more isometric angle
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on('load', () => {
      const bounds = map.current.getBounds();
      const grid = generateGrid(bounds);
      setGridData(grid);

      map.current.addSource('grid', {
        type: 'geojson',
        data: grid
      });

      map.current.addLayer({
        id: 'grid-lines',
        type: 'line',
        source: 'grid',
        paint: {
          'line-color': '#888',
          'line-width': 1
        }
      });

      map.current.addLayer({
        id: 'grid-fill',
        type: 'fill',
        source: 'grid',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'id'], selectedTileId],
            '#ffcc00',
            'rgba(0,0,0,0)'
          ],
          'fill-opacity': 0.4
        }
      });

      map.current.on('click', 'grid-fill', (e) => {
        const feature = e.features[0];
        const id = feature.properties.id;
        setSelectedTileId(id);
        setPopupInfo({
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        });
      });
    });

    map.current.on('click', (e) => handleMapClick(e));
  });

  useEffect(() => {
    if (map.current && map.current.getLayer('grid-fill')) {
      map.current.setPaintProperty('grid-fill', 'fill-color', [
        'case',
        ['==', ['get', 'id'], selectedTileId],
        '#ffcc00',
        'rgba(0,0,0,0)'
      ]);
    }
     console.log('selected ID:', selectedTileId);
  }, [selectedTileId]);

  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;

    if (isMobile) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 10,
        offset: [0, -window.innerHeight / 4]
      });
    } else {
      map.current.flyTo({
        center: [lng, lat],
        offset: [window.innerWidth / 4, 0]
      });
    }

    setPopupInfo({ lng, lat });
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      {popupInfo && (
        <InfoPanel
          info={popupInfo}
          onClose={handleClose}
          tileId={selectedTileId}
          className={isClosing ? 'closing' : ''}
        />
      )}
    </div>
  );
}

function InfoPanel({ info, onClose, tileId }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://placehold.co/600x400/orange/white',
    'https://placehold.co/600x400/red/blue',
    'https://placehold.co/600x400/yellow/green'
  ];

  return (
    <div className="info-panel">
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

export default App;
