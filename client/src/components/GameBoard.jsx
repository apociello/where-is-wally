import { useState } from 'react';
import styles from '../styles/GameBoard.module.css';

function GameBoard() {
  const [target, setTarget] = useState(null);

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

  return (
    <div className={styles.board}>
      <img
        src="/maps/winter.jpg"
        alt="Crowded winter scene"
        className={styles.image}
        onClick={handleClick}
      />

      {target && (
        <div
          className={styles.targetBox}
          style={{ left: `${target.x * 100}%`, top: `${target.y * 100}%` }}
        />
      )}
    </div>
  );
}

export default GameBoard;
