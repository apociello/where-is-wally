import styles from '../styles/Feedback.module.css';

// The role="status" container is always there, so screen readers announce each new message
function Feedback({ message }) {
  return (
    <div role="status" className={styles.container}>
      {message && <p className={`${styles.message} ${styles[message.type]}`}>{message.text}</p>}
    </div>
  );
}

export default Feedback;
