import { Link } from 'react-router';
import styles from '../styles/BackLink.module.css';

// className lets each page place it where it needs
function BackLink({ to, className, children }) {
  return (
    <Link to={to} className={className ? `${styles.back} ${className}` : styles.back}>
      {children}
    </Link>
  );
}

export default BackLink;
