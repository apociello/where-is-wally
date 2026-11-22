import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Loading from '../components/Loading';
import BackLink from '../components/BackLink';
import ErrorPage from './ErrorPage';
import { apiFetch } from '../lib/api';
import { formatTime } from '../lib/formatTime';
import styles from '../styles/LeaderboardPage.module.css';

function LeaderboardPage() {
  const { slug } = useParams();
  const [leaderboard, setLeaderboard] = useState(null); // { mapName, scores }
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`/maps/${slug}/leaderboard`)
      .then(setLeaderboard)
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <ErrorPage message={error} />;
  if (!leaderboard) return <Loading />;

  return (
    <main className={styles.page}>
      <BackLink to="/maps" className={styles.back}>
        ← Back to menu
      </BackLink>
      <h1 className={styles.title}>{leaderboard.mapName} leaderboard</h1>

      <div className={styles.card}>
        {leaderboard.scores.length === 0 ? (
          <p className={styles.empty}>No times yet. Be the first!</p>
        ) : (
          <table className={styles.table}>
            <tbody>
              {leaderboard.scores.map((score, index) => (
                // The list never changes order while it's on screen, so the position works as key
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{score.playerName}</td>
                  <td>{formatTime(score.durationMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

export default LeaderboardPage;
