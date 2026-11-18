import { Link } from 'react-router';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  return (
    <main className={styles.home}>
      <h1>Where's Wally?</h1>

      <Link to="/maps/winter" className={styles.play}>
        Play
      </Link>
    </main>
  );
}

export default HomePage;
