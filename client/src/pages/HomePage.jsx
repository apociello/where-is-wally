import { Link } from 'react-router';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  return (
    <main className={styles.home}>
      <h1>
        <img src="/logo-circular.png" alt="Where's Wally?" className={styles.logo} />
      </h1>

      <Link to="/maps" className={styles.play}>
        Play
      </Link>

      <img src="/wally-peek.png" alt="" className={styles.peek} />
    </main>
  );
}

export default HomePage;
