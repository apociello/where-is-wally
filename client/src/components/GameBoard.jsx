import { useEffect, useRef, useState } from 'react';
import CharacterMenu from './CharacterMenu';
import styles from '../styles/GameBoard.module.css';

// Temporary: will come from the API
const CHARACTERS = [
  { id: 1, name: 'Wally' },
  { id: 2, name: 'Wenda' },
  { id: 3, name: 'Wizard'},
  { id: 4, name: 'Odlaw' },
];

function GameBoard() {
  const [target, setTarget] = useState(null);
  const boardRef = useRef(null);

  // While the menu is open, close it on a click outside the board or on Escape
  useEffect(() => {
    if (!target) return;

    const handleClickOutside = (e) => {
      if (!boardRef.current.contains(e.target)) setTarget(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setTarget(null);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [target]);

  const handleClick = (e) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();

    // Position as a fraction (0–1) of the image, the same on any screen size
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    console.log({
      x: x.toFixed(4),
      y: y.toFixed(4),
      pixelX: Math.round(x * img.naturalWidth),
      pixelY: Math.round(y * img.naturalHeight),
    });

    setTarget({ x, y });
  };

  const handleSelect = (character) => {
    console.log(`Selected ${character.name} at`, target);
    setTarget(null);
  };

  return (
    <div className={styles.board} ref={boardRef}>
      <img
        src="/maps/winter.jpg"
        alt="Crowded winter scene"
        className={styles.image}
        onClick={handleClick}
      />

      {target && (
        <>
          <div
            className={styles.targetBox}
            style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
          />
          <CharacterMenu characters={CHARACTERS} position={target} onSelect={handleSelect} />
        </>
      )}
    </div>
  );
}

export default GameBoard;
