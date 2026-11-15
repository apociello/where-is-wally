import styles from '../styles/CharacterList.module.css';

function CharacterList({ characters }) {
  return (
    <ul className={styles.characters}>
      {characters.map((character) => (
        <li key={character.id} className={styles.character}>
          <img src={character.avatarUrl} alt="" className={styles.avatar} />
          <span>{character.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default CharacterList;
