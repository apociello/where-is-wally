import styles from '../styles/Feedback.module.css';

// The role="status" container is always there, so screen readers announce each new message
function Feedback({ message }) {
  return (
    <div role="status" className={styles.container}>
      {message && (
        // A new key for each message restarts its fade animation
        <p key={message.id} className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

export default Feedback;
