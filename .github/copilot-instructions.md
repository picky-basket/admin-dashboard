# Picky Basket Admin Dashboard Instructions

## Project Structure

- Keep reusable UI in `src/components/`.
- Keep route-level views in `src/components/pages/`.
- Keep custom hooks in `src/hooks/`.
- Keep app state containers in `src/store/`.
- Keep mock/static data in `src/data/`.
- Keep route and domain type definitions in `src/types/`.

## Routing Rules

- Use `react-router-dom` for all app navigation.
- Add new authenticated pages as nested routes under the protected `AppLayout` route.
- Do not add page-switching logic with local `useState` in `App.jsx`.

## State Rules

- Use `AppStoreProvider` and `useAppStore()` for cross-page dashboard state.
- Keep UI-only local state inside individual page/components.
- Do not introduce API fetching in the store yet; keep using `src/data/mockData.js`.

## API Documentation Reference (No Integration Yet)

The API contracts are documented under `docs/api/`.

- `docs/api/auth.json`
  - Includes auth endpoints like signup, login, logout.
  - Login examples include bearer token payload (`accessToken`, `refreshToken`).
- `docs/api/products.json`
  - Includes product category endpoints (add/update and auth requirements).
- `docs/api/order.json`
  - Includes cart/order-related endpoints and response shapes.
- `docs/api/payment.json`
  - Includes payment initialization and payment webhook endpoints.
- `docs/api/user.json`
  - Includes user profile get/update endpoints.

Until API integration is explicitly requested:

- Keep all pages wired to local mock data.
- Reflect API field names in new type definitions where practical.
- Avoid adding fetch clients, interceptors, or token persistence logic.

## Coding Style

- Prefer named exports for components, hooks, and store utilities.
- Keep files small and focused; extract UI blocks rather than growing page files.
- Avoid introducing TypeScript in this pass; keep JavaScript + JSDoc typing.
