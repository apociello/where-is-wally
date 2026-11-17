import { useEffect, useRef, useState } from 'react';
import CharacterMenu from './CharacterMenu';
import styles from '../styles/GameBoard.module.css';

function GameBoard({ map, characters, found, onImageLoad, onGuess }) {
  const [target, setTarget] = useState(null);
  const boardRef = useRef(null);

  // Circle diameter as a % of the image width, from the radius the server checks with
  const circleSize = ((map.targetRadius * 2) / map.width) * 100;

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
    onGuess(character, target);
    setTarget(null);
  };

  return (
    <div className={styles.board} ref={boardRef}>
      <img
        src={map.imageUrl}
        alt={`${map.name} scene`}
        className={styles.image}
        onClick={handleClick}
        onLoad={onImageLoad}
      />

      {found.map((marker) => (
        <div
          key={marker.characterId}
          className={styles.marker}
          style={{
            left: `${marker.x * 100}%`,
            top: `${marker.y * 100}%`,
            width: `${circleSize}%`,
          }}
        />
      ))}

      {target && (
        <>
          <div
            className={styles.targetBox}
            style={{
              left: `${target.x * 100}%`,
              top: `${target.y * 100}%`,
              width: `${circleSize}%`,
            }}
          />
          <CharacterMenu characters={characters} position={target} onSelect={handleSelect} />
        </>
      )}
    </div>
  );
}

export default GameBoard;
