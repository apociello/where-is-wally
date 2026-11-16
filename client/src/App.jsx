import { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';
import CharacterList from './components/CharacterList';
import { apiFetch } from './lib/api';
import styles from './styles/App.module.css';

// Only one map for now; later it will come from the URL
const MAP_SLUG = 'winter';

function App() {
  const [map, setMap] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/maps/${MAP_SLUG}`)
      .then(setMap)
      .catch((err) => setError(err.message));
  }, []);

  // The game (and its clock) starts on the server once the image is on screen
  const startGame = () => {
    apiFetch(`/maps/${MAP_SLUG}/games`, { method: 'POST' })
      .then((data) => setGameId(data.gameId))
      .catch((err) => setError(err.message));
  };

  if (error) return <p>{error}</p>;
  if (!map) return <p className={styles.loading}>Loading...</p>;

  const isReady = gameId !== null;

  return (
    <>
      {!isReady && <p className={styles.loading}>Loading...</p>}

      {/* Hidden until the game exists, so nobody sees the scene before the clock starts */}
      <div className={isReady ? undefined : styles.hidden}>
        <GameBoard map={map} onImageLoad={startGame} />
        <CharacterList characters={map.characters} />
      </div>
    </>
  );
}

export default App;
