# Picky Basket Admin Dashboard Instructions

## Project Overview
The Picky Basket Admin Dashboard is a React-based web application designed to provide administrators with an intuitive interface for managing products, customers, and orders. The dashboard includes features such as product management, customer management, order tracking, and analytics. The project is structured to promote modularity and maintainability, with a clear separation of concerns between components, pages, API interactions, and state management.

## Frontend Architecture

### Tech Stack

- **Framework**: React 18+
- **Language**: TypeScript (optional but recommended)
- **Routing**: React Router v6
- **State Management**: Context API or Redux (choose based on complexity)
- **HTTP Client**: Axios with interceptors for auth/error handling
- **UI Framework**: Material-UI (MUI) / Tailwind CSS (choose one)
- **Forms**: React Hook Form + Zod/Yup validation
- **Tables**: TanStack Table (React Table)
- **Data Fetching**: React Query / SWR (for server state)
- **Styling**: CSS Modules / Tailwind CSS
- **Testing**: Jest + React Testing Library


## Project Structure
```
admin-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── common/                    # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   ├── AdminLayout.tsx        # Main layout wrapper
│   │   │   └── AuthLayout.tsx
│   │   │   |__ ...   
│   │   └── features/                  # Feature-specific components
│   │       ├── customers/
│   │       ├── products/
│   │       └── ...
│   ├── pages/
│   │   ├── Dashboard.tsx              # Main dashboard page
│   │   ├── Login.tsx
│   │   ├── Customers.tsx
│   │   ├── Products.tsx
│   │   ├── Orders.tsx
│   │   └── ...
│   ├── api/
│   │   ├── client.ts                  # Axios instance with interceptors
│   │   ├── hooks/                     # Custom hooks for API calls
│   │   │   ├── useCustomers.ts
│   │   │   ├── useProducts.ts
│   │   │   ├── useOrders.ts
│   │   │   └── ...
│   │   └── services/                  # API service functions
│   │       ├── auth.ts
│   │       ├── customers.ts
│   │       ├── products.ts
│   │       ├── orders.ts
│   │       ├── formSchemas.ts
│   │       └── ...
│   ├── context/                       # Context providers
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   ├── types/
│   │   ├── index.ts                   # Common types
│   │   ├── models.ts                  # Data models matching backend
│   │   └── api.ts                     # API request/response types
│   ├── utils/
│   │   ├── validation.ts              # Form validation rules
│   │   ├── formatting.ts              # Data formatting utilities
│   │   ├── constants.ts               # App constants
│   │   └── helpers.ts                 # General utilities
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.tsx                        # Main app component
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts (or webpack.config.js)
└── README.md
```

## State Management & Data Fetching

### Context API (AppStore)
- **Use for**: Cross-page dashboard state (loggedIn, darkMode, user info)
- **Location**: `src/store/appStore.jsx`
- **Pattern**: Context + useState
- **Exports**: `useAppStore()` hook for consumption

### TanStack Query
- **Use for**: Server state and API data fetching (products, orders, customers, etc.)
- **Location**: Query hooks in `src/api/hooks/`
- **Pattern**: `useQuery` for GET requests, `useMutation` for POST/PATCH/DELETE
- **Query Keys**: Structured arrays like `['products']`, `['orders']`, `['users', userId]`
- **Cache Strategy**: 
  - Products/categories: 5-10 min staleTime
  - Orders/customers: 2-5 min staleTime
  - User profile: 10 min staleTime
- **Error Handling**: Queries return `{ data, isLoading, error, isError }` — check error state in components
- **Refetching**: Automatic on window focus (default). Disable with `refetchOnWindowFocus: false` if needed

### Custom Query Hooks
Each API resource should have a custom hook in `src/api/hooks/`:
```typescript
// Example: useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/products.ts';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
}
```

**Usage in components:**
```jsx
function ProductsPage() {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <ProductsList products={data} />;
}
```

## API Integration

### Active Integrations
- **Auth**: Login (email/password) → stores accessToken/refreshToken
- **Products**: GET /api/v1/products + GET /api/v1/product/categories

### API Architecture
- **Client**: `src/api/client.ts` — 5 axios clients (auth, product, order, payment, user) with interceptors
- **Interceptors**: 
  - Request: Attach `Authorization: Bearer <accessToken>` header
  - Response: Auto-refresh token on 401, retry original request, sign out if refresh fails
- **Services**: `src/api/services/` — Functions that call API endpoints (e.g., `loginUser()`, `getProducts()`)
- **Hooks**: `src/api/hooks/` — TanStack Query hooks wrapping services (e.g., `useProducts()`, `useCategories()`)
- **Token Store**: `src/api/tokenStore.js` — Module-level store backed by localStorage (survives page refresh)

### Base URLs (from src/api/client.ts)
- Auth: `https://auth-staging.pickybasket.com/`
- Products: `https://product-staging.pickybasket.com/`
- Orders: `https://order-staging.pickybasket.com/`
- Payments: `https://payment-staging.pickybasket.com/`
- Users: `https://user-staging.pickybasket.com/`

### API Documentation
Full API contracts are documented in `docs/api/` (OpenAPI/JSON schemas):
- `docs/api/auth.json` — Login, signup, token refresh
- `docs/api/products.json` — Products, categories (CRUD)
- `docs/api/order.json` — Orders, cart
- `docs/api/payment.json` — Payment initialization, webhooks
- `docs/api/user.json` — User profile get/update

### Code Standards

1. **File Naming**
   - Components: PascalCase (e.g., `UsersList.tsx`)
   - Services: camelCase (e.g., `usersService.ts`)
   - Hooks: camelCase with `use` prefix (e.g., `useUsers.ts`)
   - Types: PascalCase (e.g., `User.ts`)

2. **Import Organization**
   - External dependencies first
   - Internal modules second
   - Types/interfaces third
   - Styles last

3. **Component Structure**
   - Props interface at top
   - Component logic
   - Effects
   - Event handlers
   - JSX return
   - Export at bottom

4. **Error Handling**
   - Use try/catch in async operations
   - Display user-friendly error messages
   - Log errors to console in development
   - Send to error tracking in production

5. **TypeScript**
   - Avoid `any` type
   - Use proper interfaces/types
   - Export types from files
   - Use generic types appropriately

### Adding New API Integrations

To integrate a new API resource (e.g., customers, orders):

1. **Create service file** (`src/api/services/{resource}.ts`):
   - Define request/response types
   - Export async functions that call the appropriate API client
   - Example: `getOrders()`, `createOrder(data)`

2. **Create hook file** (`src/api/hooks/use{Resource}.ts`):
   - Use `useQuery()` for GET requests
   - Use `useMutation()` for POST/PATCH/DELETE
   - Set appropriate `staleTime` and `retry` options
   - Define query keys

3. **Update component** (page or component file):
   - Import the hook
   - Call the hook to get `{ data, isLoading, error }`
   - Handle loading/error states
   - Sync data to `useAppStore()` if needed for cross-page access

Example:
```typescript
// src/api/services/orders.ts
export async function getOrders(): Promise<Order[]> {
  const { data } = await orderApiClient.get('/api/v1/orders');
  return data.data;
}

// src/api/hooks/useOrders.ts
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders(),
    staleTime: 5 * 60 * 1000
  });
}

// src/pages/OrdersPage.jsx
const { data: orders, isLoading, error } = useOrders();
if (isLoading) return <Loading />;
if (error) return <Error />;
```


### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy (varies by platform)
npm run deploy
```

## Useful Design Patterns

### 1. Pagination Pattern

- Use cursor-based pagination from backend
- Store cursor state in URL params
- Implement next/previous page navigation
- Show current page information

### 2. Search & Filter Pattern

- Combine multiple filter options
- Use debounce for search inputs
- Reset filters button
- Save filter state in URL

### 3. Modal/Dialog Pattern

- Confirmation dialogs for destructive actions
- Edit dialogs with pre-filled data
- Create dialogs for new records
- Form validation before submission

### 4. Loading States

- Show skeleton loaders for tables
- Keep dashboard cards mounted during period/filter changes and use per-card skeleton placeholders while data refetches
- Disable submit buttons during submission
- Show loading indicators on action buttons
- Handle loading state for async operations

### 5. Error Handling

- Display toast notifications for errors
- Show validation errors on forms
- Log errors with context
- Provide user-friendly error messages


## Security Considerations

1. **Authentication**
   - Store token in localStorage or sessionStorage
   - Validate token on app initialization
   - Implement token refresh mechanism
   - Auto-logout on token expiration

2. **Authorization**
   - Check user role/permissions before rendering
   - Restrict page access via route guards
   - Hide sensitive actions from unauthorized users

3. **Data Protection**
   - Sanitize user inputs
   - Validate data types on client
   - Use HTTPS for API calls
   - Never expose sensitive data in logs

4. **CORS**
   - Configure CORS correctly for backend
   - Handle CORS errors gracefully
   - Use credentials in requests if needed


## Common Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "@mui/material": "^5.0.0",
    "@mui/icons-material": "^5.0.0",
    "date-fns": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^4.0.0",
    "@types/react": "^18.0.0",
    "vitest": "^0.30.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

## Performance Optimization

1. **Code Splitting**
   - Lazy load route components
   - Use React.lazy for component splitting
   - Implement error boundaries

2. **Data Fetching**
   - Use React Query for caching
   - Implement request deduplication
   - Cancel previous requests on unmount

3. **Rendering**
   - Memoize expensive components (React.memo)
   - Use useMemo for computed values
   - Use useCallback for event handlers

4. **Bundle Size**
   - Tree shake unused dependencies
   - Analyze bundle with webpack-bundle-analyzer
   - Use dynamic imports

## Debugging Tips

1. **Use React DevTools**
   - Inspect component tree
   - Check props and state
   - Profile component renders

2. **Use Network Tab**
   - Monitor API requests
   - Check response payloads
   - Verify headers and auth tokens

3. **Console Logging**
   - Log API responses
   - Log state changes
   - Log error details

4. **Browser Storage**
   - Check localStorage for token
   - Verify stored preferences
   - Clear cache when needed

## Additional Resources

- Backend API Docs: See backend repository documentation
- Component Library: Configure Material-UI or Tailwind CSS
- State Management: Choose Context API, Redux, or Zustand based on needs
- Authentication: Implement JWT token management
- Testing: Set up Jest and React Testing Library
