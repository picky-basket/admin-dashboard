export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  ORDERS: '/orders',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  CUSTOMERS: '/customers',
  PAYMENTS: '/payments',
  SETTINGS: '/settings'
};

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD },
  { key: 'orders', label: 'Orders', path: ROUTES.ORDERS },
  { key: 'products', label: 'Products', path: ROUTES.PRODUCTS },
  { key: 'categories', label: 'Categories', path: ROUTES.CATEGORIES },
  { key: 'customers', label: 'Customers', path: ROUTES.CUSTOMERS },
  { key: 'payments', label: 'Payments', path: ROUTES.PAYMENTS },
  { key: 'settings', label: 'Settings', path: ROUTES.SETTINGS }
];
