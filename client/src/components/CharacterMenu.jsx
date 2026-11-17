import styles from '../styles/CharacterMenu.module.css';

function CharacterMenu({ characters, position, onSelect }) {
  // Below the circle by default, above when the click is near the bottom
  const placement = position.y > 0.7 ? styles.above : styles.below;

  return (
    <ul
      className={`${styles.menu} ${placement}`}
      style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }}
    >
      {characters.map((character) => (
        <li key={character.id}>
          <button
            type="button"
            className={styles.option}
            disabled={character.found}
            onClick={() => onSelect(character)}
          >
            {character.name}
            {character.found && ' ✓'}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default CharacterMenu;
