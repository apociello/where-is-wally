import BackLink from '../components/BackLink';
import styles from '../styles/ErrorPage.module.css';

function ErrorPage({ message = 'Page not found' }) {
  return (
    <main className={styles.page}>
      <h1 className={styles.message}>{message}</h1>
      <BackLink to="/">← Back to home</BackLink>
    </main>
  );
}

export default ErrorPage;
