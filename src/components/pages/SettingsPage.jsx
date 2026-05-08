import { useAppStore } from '../../store/appStore.jsx';
import { PageCard } from '../common/PageCard.jsx';

export function SettingsPage() {
  const { darkMode, setDarkMode, setLoggedIn } = useAppStore();

  return (
    <PageCard title="Settings" subtitle="Project and session settings">
      <div className="settings-row">
        <span>Theme</span>
        <button type="button" onClick={() => setDarkMode((value) => !value)}>
          {darkMode ? 'Use Light Mode' : 'Use Dark Mode'}
        </button>
      </div>

      <div className="settings-row">
        <span>Session</span>
        <button type="button" onClick={() => setLoggedIn(false)}>Log Out</button>
      </div>
    </PageCard>
  );
}
