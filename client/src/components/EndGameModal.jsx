import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../lib/formatTime';
import styles from '../styles/EndGameModal.module.css';

function EndGameModal({ durationMs, onSaveName }) {
  const dialogRef = useRef(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [error, setError] = useState(null);

  // showModal() opens the <dialog> on top of everything and blocks the page behind it
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    setError(null);

    try {
      await onSaveName(name);
      setStatus('saved');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    // onCancel: Escape doesn't close it, so the name isn't lost by accident
    <dialog ref={dialogRef} className={styles.modal} onCancel={(e) => e.preventDefault()}>
      <h2>You found everyone!</h2>
      <p>
        Your time: <strong className={styles.time}>{formatTime(durationMs)}</strong>
      </p>

      {status === 'saved' ? (
        <p className={styles.saved}>Saved! ✓</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="player-name">Your name for the leaderboard</label>
          <div className={styles.row}>
            <input
              id="player-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              required
            />
            <button type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}

      <button type="button" className={styles.playAgain} onClick={() => window.location.reload()}>
        Play again
      </button>
    </dialog>
  );
}

export default EndGameModal;
