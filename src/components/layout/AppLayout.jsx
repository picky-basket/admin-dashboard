import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from '../../types/routes.js';
import { useAppStore } from '../../store/appStore.jsx';
import { useBreakpoint } from '../../hooks/useBreakpoint.js';

export function AppLayout() {
  const { darkMode, setDarkMode, pendingOrders } = useAppStore();
  const { isMobile } = useBreakpoint();

  return (
    <div className={darkMode ? 'app-shell dark' : 'app-shell'}>
      <aside className="sidebar">
        <div className="brand">Picky Basket Admin</div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <span>{item.label}</span>
              {item.key === 'orders' && pendingOrders > 0 ? <span className="badge">{pendingOrders}</span> : null}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="toggle-btn"
          onClick={() => setDarkMode((value) => !value)}
        >
          {darkMode ? 'Switch to Light' : 'Switch to Dark'}
        </button>
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
