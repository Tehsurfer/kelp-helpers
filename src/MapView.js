import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import InfoPanel from './InfoPanel';
import coastlineTiles from './data/coastline-tiles';
import useTilesData from './useTilesData';

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;
const dataGateWayURL = import.meta.env.VITE_REACT_APP_DATA_GATEWAY_URL;

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

// Helper to sample 5 points: 4 corners and center
function sample5Points(polygon) {
  const coords = polygon.geometry.coordinates[0];
  const [lng1, lat1] = coords[0]; // bottom-left
  const [lng2, lat2] = coords[1]; // bottom-right
  const [lng3, lat3] = coords[2]; // top-right
  const [lng4, lat4] = coords[3]; // top-left
  // Center
  const centerLng = (lng1 + lng3) / 2;
  const centerLat = (lat1 + lat3) / 2;
  return [
    [lng1, lat1], // bottom-left
    [lng2, lat2], // bottom-right
    [lng3, lat3], // top-right
    [lng4, lat4], // top-left
    [centerLng, centerLat] // center
  ];
}

function MapView({ popupInfo, setPopupInfo, selectedTileId, setSelectedTileId }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(174.9690922595569);
  const [lat, setLat] = useState(-36.69274459161924);
  const [zoom, setZoom] = useState(14);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [gridData, setGridData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const apiUrl = '/api/tiles'; 
  const { tilesData, loading, error } = useTilesData(apiUrl);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setPopupInfo(null);
    }, 300); // adjust for CSS animation duration if needed
  };


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

    map.current.on('load', async () => {
      // Try to load from saved data first
      let filteredGrid = null;
      const presetCoastTiles = coastlineTiles
      if (presetCoastTiles) {
        try {
          console.log('about to use preset coastline tiles:')
          filteredGrid = presetCoastTiles
          setGridData(presetCoastTiles);
          console.log('Using preset coastline tiles:', presetCoastTiles);
        } catch (e) {
          console.warn('Failed to parse cached filteredGrid:', e);
        }
      }

      if (!filteredGrid) {
        console.log('Generating grid from map bounds...');
        const bounds = map.current.getBounds();
        const grid = generateGrid(bounds);
        const filteredFeatures = [];

        // Sample 5 points from each polygon to check for water and land
        for (const polygon of grid.features) {
          const points = sample5Points(polygon);
          let hasWater = false;
          let hasLand = false;
          for (const [lng, lat] of points) {
            const features = map.current.queryRenderedFeatures(
              map.current.project([lng, lat])
            );
            if (features.length > 0) {
              for (let i = 0; i < features.length; i++) {
                const feature = features[i];
                if (feature.layer.id === 'water') {
                  hasWater = true;
                // Everything but the water-shadow layer will be land (There are a lot of ferry routes that show up otherwise)
                } else if (feature.layer.id !== 'water-shadow') {
                  hasLand = true;
                }
                if (hasWater && hasLand) break;
              }
            }
          }
          // Only keep polygons that have both water and land
          // This is a bit of a hack, but it works for now
          if (hasWater && hasLand) {
            filteredFeatures.push(polygon);
          }
        }

        filteredGrid = {
          type: 'FeatureCollection',
          features: filteredFeatures
        };
        setGridData(filteredGrid);
        // Save to localStorage to then use to populate coastline-tiles.js
        localStorage.setItem('filteredGrid', JSON.stringify(filteredGrid));
      }

      map.current.addSource('grid', {
        type: 'geojson',
        data: filteredGrid
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
    
    // playing around with how to find the coastline
    const features = map.current.queryRenderedFeatures(
        map.current.project([lng, lat]), 
        { layers: ['water'] }
    );
    const isOcean = features.length > 0;
    console.log('Ocean click:', isOcean);

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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className='lat-long-info'
      >
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      {popupInfo && (
        <InfoPanel
          info={popupInfo}
          onClose={handleClose}
          tileId={selectedTileId}
          className={isClosing ? 'closing' : ''}
          tilesData={tilesData}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

export default MapView;