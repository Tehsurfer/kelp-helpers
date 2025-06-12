import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;
const dataGateWayURL = import.meta.env.VITE_REACT_APP_DATA_GATEWAY_URL;

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

    map.current.on('load', async () => {
      const bounds = map.current.getBounds();
      const grid = generateGrid(bounds);
      const filteredFeatures = [];

      for (const polygon of grid.features) {
        const points = sample5Points(polygon);
        let hasWater = false;
        let hasLand = false;
        for (const [lng, lat] of points) {
          const features = map.current.queryRenderedFeatures(
            map.current.project([lng, lat]),
            { layers: ['water'] }
          );
          console.log('Features at point:', features);
          if (features.length > 0) {
            hasWater = true;
          } else {
            hasLand = true;
          }
          if (hasWater && hasLand) break;
        }
        if (hasWater && hasLand) {
          filteredFeatures.push(polygon);
        }
      }

      const filteredGrid = {
        type: 'FeatureCollection',
        features: filteredFeatures
      };
      setGridData(filteredGrid);

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
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapView;