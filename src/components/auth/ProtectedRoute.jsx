import { Navigate, useRouterState } from '@tanstack/react-router';
import { useAppStore } from '../../store/appStore.jsx';
import { ROUTES } from '../../types/routes.js';

export function ProtectedRoute({ children }) {
  const { loggedIn } = useAppStore();
  const location = useRouterState({ select: (state) => state.location });

  if (!loggedIn) {
    return <Navigate to={ROUTES.LOGIN} search={{ redirect: location.href }} />;
  }

  return children;
}
