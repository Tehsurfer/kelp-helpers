import { useEffect, useState } from 'react';

const mode = import.meta.env.VITE_REACT_APP_MODE || 'production';

let apiUrl;

if (mode === 'development') {
  apiUrl = '/api/tiles'; // Use proxy in development
  console.warn(`Using local API URL: ${apiUrl}`);
} else {
  const apiBase = import.meta.env.VITE_REACT_APP_KH_API_URL || 'http://localhost:5000';
  apiUrl = `${apiBase}/get-tile-data`;
}

export default function useTilesData() {
  const [tilesData, setTilesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tiles data');
        return res.json();
      })
      .then(data => {
        setTilesData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [apiUrl]);

  return { tilesData, loading, error };
}
