import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import GameBoard from '../components/GameBoard';
import CharacterList from '../components/CharacterList';
import Feedback from '../components/Feedback';
import EndGameModal from '../components/EndGameModal';
import ErrorPage from './ErrorPage';
import Loading from '../components/Loading';
import { apiFetch } from '../lib/api';
import styles from '../styles/GamePage.module.css';

function GamePage() {
  const { slug } = useParams();
  const [map, setMap] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [found, setFound] = useState([]); // [{ characterId, x, y }]: x, y = where to draw its marker
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const [durationMs, setDurationMs] = useState(null); // Set by the server when the game ends
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/maps/${slug}`)
      .then(setMap)
      .catch((err) => setError(err.message));
  }, [slug]);

  // Each new message hides itself after 2 seconds
  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // The game (and its clock) starts on the server once the image is on screen
  const startGame = () => {
    apiFetch(`/maps/${slug}/games`, { method: 'POST' })
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
        setFeedback({ type: 'success', text: `You found ${character.name}!` });
        if (result.finished) setDurationMs(result.durationMs);
      } else {
        setFeedback({ type: 'error', text: `That's not ${character.name}. Keep looking!` });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const saveName = (name) =>
    apiFetch(`/games/${gameId}`, { method: 'PATCH', body: { name } });

  if (error) return <ErrorPage message={error} />;
  if (!map) return <Loading />;

  const isReady = gameId !== null;

  // Each character with a found flag, so the menu and the list only have to check character.found
  const characters = map.characters.map((character) => ({
    ...character,
    found: found.some((f) => f.characterId === character.id),
  }));

  return (
    <>
      {!isReady && <Loading />}

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

      <Feedback message={feedback} />
      {durationMs !== null && <EndGameModal durationMs={durationMs} onSaveName={saveName} />}
    </>
  );
}

export default GamePage;
