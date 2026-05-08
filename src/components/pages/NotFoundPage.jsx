import { Link } from 'react-router-dom';
import { ROUTES } from '../../types/routes.js';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>The route you requested does not exist.</p>
      <Link to={ROUTES.DASHBOARD}>Return to dashboard</Link>
    </div>
  );
}
