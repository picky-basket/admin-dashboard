import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useMemo } from 'react';
import { AppStoreProvider, useAppStore } from './store/appStore.jsx';
import { router } from './router/index.jsx';
import './styles/appShell.css';

function AppRouter() {
  const store = useAppStore();

  const queryClient = useMemo(() => new QueryClient(), []);
  const appRouter = useMemo(() => router, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} context={{ store }} />
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <AppRouter />
    </AppStoreProvider>
  );
}
