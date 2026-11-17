import { useEffect, useRef } from 'react';
import { formatTime } from '../lib/formatTime';
import styles from '../styles/EndGameModal.module.css';

function EndGameModal({ durationMs }) {
  const dialogRef = useRef(null);

  // showModal() opens the <dialog> on top of everything and blocks the page behind it
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.modal}>
      <h2>You found everyone!</h2>
      <p>
        Your time: <strong className={styles.time}>{formatTime(durationMs)}</strong>
      </p>
    </dialog>
  );
}

export default EndGameModal;
