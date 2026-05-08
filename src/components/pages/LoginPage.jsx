import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore.jsx';
import { ROUTES } from '../../types/routes.js';

export function LoginPage() {
  const { loggedIn, setLoggedIn } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (loggedIn) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const submit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoggedIn(true);
    const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <h1>Picky Basket Admin</h1>
        <p>Sign in to continue</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="admin@pickybasket.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
