import { Link } from 'react-router';

function ErrorPage({ message = 'Page not found' }) {
  return (
    <main>
      <h1>{message}</h1>
      <Link to="/">Back to the home page</Link>
    </main>
  );
}

export default ErrorPage;
