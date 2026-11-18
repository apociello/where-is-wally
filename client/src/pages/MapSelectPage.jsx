import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Loading from '../components/Loading';
import ErrorPage from './ErrorPage';
import { apiFetch } from '../lib/api';
import styles from '../styles/MapSelectPage.module.css';

function MapSelectPage() {
  const [maps, setMaps] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/maps')
      .then(setMaps)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorPage message={error} />;
  if (!maps) return <Loading />;

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back
      </Link>
      <h1>Choose a map</h1>

      <ul className={styles.maps}>
        {maps.map((map) => (
          <li key={map.slug}>
            <Link to={`/maps/${map.slug}`} className={styles.card}>
              <img src={map.imageUrl} alt="" className={styles.thumbnail} />
              <span className={styles.name}>{map.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default MapSelectPage;
