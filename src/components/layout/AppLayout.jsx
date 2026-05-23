import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { NAV_ITEMS } from '../../types/routes.js';
import { useAppStore } from '../../store/appStore.jsx';
import { useBreakpoint } from '../../hooks/useBreakpoint.js';

export function AppLayout() {
  const { darkMode, setDarkMode, pendingOrders, signOut } = useAppStore();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const handleLogout = () => {
    signOut();
    navigate({ to: '/login' });
  };

  return (
    <div className={darkMode ? 'app-shell dark' : 'app-shell'}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🧵</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">Picky Basket</span>
            <span className="sidebar-brand-sub">Admin Portal</span>
          </div>
        </div>

        <nav>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={
                pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              <span className="nav-item-inner">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </span>
              {item.key === 'orders' && pendingOrders > 0 ? <span className="badge">{pendingOrders}</span> : null}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="sidebar-avatar">A</div>
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">Admin</span>
              <span className="sidebar-profile-email">admin@pickybasket.com</span>
            </div>
          </div>
          <div className="sidebar-footer-actions">
            <button type="button" className="sidebar-icon-btn" title={darkMode ? 'Switch to light' : 'Switch to dark'} onClick={() => setDarkMode((d) => !d)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link to="/settings" className="sidebar-icon-btn" title="Settings">
              ⚙️
            </Link>
          </div>
          <button type="button" className="sidebar-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="content-shell">
        {isMobile ? <div className="mobile-title">Admin Dashboard</div> : null}
        <main className="content-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
