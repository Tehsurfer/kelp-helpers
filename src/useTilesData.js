import { useEffect, useState } from 'react';

const apiUrl = `/api/tiles`;

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
