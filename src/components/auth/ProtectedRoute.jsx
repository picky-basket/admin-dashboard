import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/appStore.jsx';
import { ROUTES } from '../../types/routes.js';

export function ProtectedRoute({ children }) {
  const { loggedIn } = useAppStore();
  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return children;
}
