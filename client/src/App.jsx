import { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import { apiFetch } from './lib/api';

// Only one map for now; later it will come from the URL
const MAP_SLUG = 'winter';

function App() {
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/maps/${MAP_SLUG}`)
      .then(setMap)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!map) return <p>Loading...</p>;

  return <GameBoard map={map} />;
}

export default App;
