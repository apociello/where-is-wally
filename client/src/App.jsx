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
  const [found, setFound] = useState([]); // [{ characterId, x, y }]: x, y = where to draw its marker
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

  const handleGuess = async (character, position) => {
    try {
      const result = await apiFetch(`/games/${gameId}/guesses`, {
        method: 'POST',
        body: { characterId: character.id, x: position.x, y: position.y },
      });
      if (result.correct) {
        setFound((prev) => [...prev, { characterId: character.id, ...result.marker }]);
      }
      console.log(character.name, result);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (error) return <p>{error}</p>;
  if (!map) return <p className={styles.loading}>Loading...</p>;

  const isReady = gameId !== null;

  // Each character with a found flag, so the menu and the list only have to check character.found
  const characters = map.characters.map((character) => ({
    ...character,
    found: found.some((f) => f.characterId === character.id),
  }));

  return (
    <>
      {!isReady && <p className={styles.loading}>Loading...</p>}

      {/* Hidden until the game exists, so nobody sees the scene before the clock starts */}
      <div className={isReady ? undefined : styles.hidden}>
        <GameBoard
          map={map}
          characters={characters}
          found={found}
          onImageLoad={startGame}
          onGuess={handleGuess}
        />
        <CharacterList characters={characters} />
      </div>
    </>
  );
}

export default App;
