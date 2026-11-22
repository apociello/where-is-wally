import { useEffect, useRef, useState } from 'react';
import BackLink from './BackLink';
import { formatTime } from '../lib/formatTime';
import styles from '../styles/EndGameModal.module.css';

function EndGameModal({ durationMs, onSaveName }) {
  const dialogRef = useRef(null);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // showModal() opens the <dialog> on top of everything and blocks the page behind it
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await onSaveName(name);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    // onCancel: Escape doesn't close it, so the name isn't lost by accident
    <dialog ref={dialogRef} className={styles.modal} onCancel={(e) => e.preventDefault()}>
      <h2 className={styles.title}>You found everyone!</h2>
      <p className={styles.time}>{formatTime(durationMs)}</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <input
            value={name}
            placeholder="Your name"
            aria-label="Your name"
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoComplete="off"
            required
          />
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <BackLink to="/maps" className={styles.menu}>
        ← Back to menu
      </BackLink>
    </dialog>
  );
}

export default EndGameModal;
