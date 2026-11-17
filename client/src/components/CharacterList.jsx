import styles from '../styles/CharacterList.module.css';

function CharacterList({ characters }) {
  return (
    <ul className={styles.characters}>
      {characters.map((character) => (
        <li
          key={character.id}
          className={character.found ? `${styles.character} ${styles.found}` : styles.character}
        >
          <img src={character.avatarUrl} alt="" className={styles.avatar} />
          <span>
            {character.name}
            {character.found && ' ✓'}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default CharacterList;
